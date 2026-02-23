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

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Finance App API",
        Version = "v1",
        Description = "API for managing personal finances with shared categories"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token"
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


// ================= DATABASE CONFIGURATION =================
// Railway-compatible connection

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

string connectionString;

if (!string.IsNullOrEmpty(databaseUrl))
{
    // Railway DATABASE_URL format
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
else if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PGHOST")))
{
    // Railway individual variables fallback
    connectionString =
        $"Host={Environment.GetEnvironmentVariable("PGHOST")};" +
        $"Port={Environment.GetEnvironmentVariable("PGPORT")};" +
        $"Database={Environment.GetEnvironmentVariable("PGDATABASE")};" +
        $"Username={Environment.GetEnvironmentVariable("PGUSER")};" +
        $"Password={Environment.GetEnvironmentVariable("PGPASSWORD")};" +
        $"SSL Mode=Require;Trust Server Certificate=true";
}
else
{
    // Local development
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Connection string not found.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));


// ================= CORS =================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://frontend:80"
            // Add your Railway frontend URL later
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// ================= JWT =================

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });


// ================= DEPENDENCY INJECTION =================

builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<ICategoryShareRepository, CategoryShareRepository>();
builder.Services.AddScoped<ICategoryMonthConfigRepository, CategoryMonthConfigRepository>();


var app = builder.Build();


// ================= MIGRATIONS WITH RETRY =================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        var retryCount = 0;
        var maxRetries = 10;

        while (retryCount < maxRetries)
        {
            try
            {
                context.Database.Migrate();
                logger.LogInformation("Database migration completed successfully!");
                break;
            }
            catch (Exception ex)
            {
                retryCount++;
                logger.LogWarning(
                    $"Migration attempt {retryCount} failed: {ex.Message}");

                if (retryCount >= maxRetries)
                {
                    logger.LogError("Could not connect to database.");
                    throw;
                }

                Thread.Sleep(3000);
            }
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error while migrating database.");
        throw;
    }
}


// ================= HTTP PIPELINE =================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Finance App API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();