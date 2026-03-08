using Microsoft.EntityFrameworkCore;
using FinanceApp.Api.Data;
using FinanceApp.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FinanceApp.Api.Services.Intefaces;
using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Data.Repositories;
using FinanceApp.Api.Services.Interfaces;
using Microsoft.OpenApi.Models;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

//
// 🔥 CRÍTICO PARA RAILWAY — escutar fora do localhost
//
builder.WebHost.UseUrls("http://0.0.0.0:8080");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

//
// 🧾 SWAGGER
//
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Finance App API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

//
// 🐘 DATABASE — Railway PostgreSQL
//
string connectionString;

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

if (!string.IsNullOrEmpty(databaseUrl))
{
    // Format: postgres://user:pass@host:port/db
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');

    connectionString =
        $"Host={uri.Host};" +
        $"Port={uri.Port};" +
        $"Database={uri.AbsolutePath.TrimStart('/')};" +
        $"Username={userInfo[0]};" +
        $"Password={userInfo[1]};" +
        $"SSL Mode=Require;Trust Server Certificate=true";
}
else
{
    throw new Exception("DATABASE_URL not found");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

//
// 🌐 CORS — permitir frontend Railway
//
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

//
// 🔐 JWT
//
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? Environment.GetEnvironmentVariable("JWT_KEY")
    ?? throw new InvalidOperationException("JWT Key not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

//
// 🧩 DEPENDENCY INJECTION
//
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<ICategoryShareRepository, CategoryShareRepository>();
builder.Services.AddScoped<ICategoryMonthConfigRepository, CategoryMonthConfigRepository>();
builder.Services.AddScoped<ISavingsGoalRepository, SavingsGoalRepository>();
builder.Services.AddScoped<ISavingsGoalService, SavingsGoalService>();
builder.Services.AddScoped<IUserMonthBudgetRepository, UserMonthBudgetRepository>();
builder.Services.AddScoped<IUserMonthBudgetService, UserMonthBudgetService>();
builder.Services.AddScoped<IFixedExpenseRepository, FixedExpenseRepository>();
builder.Services.AddScoped<IFixedExpenseMonthRepository, FixedExpenseMonthRepository>();
builder.Services.AddScoped<IFixedExpenseService, FixedExpenseService>();

var app = builder.Build();

//
// 🧪 HEALTH CHECK (importantíssimo)
//
app.MapGet("/", () => "Finance API running 🚀");

//
// 🧾 SWAGGER EM PRODUÇÃO
//
app.UseSwagger();
app.UseSwaggerUI();

//
// 🌐 PIPELINE
//
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

//
// 🧠 MIGRATIONS COM RETRY
//
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        for (int i = 1; i <= 10; i++)
        {
            try
            {
                context.Database.Migrate();
                logger.LogInformation("Database migrated successfully");
                break;
            }
            catch (Exception ex)
            {
                logger.LogWarning($"Migration attempt {i} failed: {ex.Message}");
                Thread.Sleep(3000);
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Migration failed: " + ex.Message);
    }
}

app.Run();