using Microsoft.EntityFrameworkCore;
using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<CategoryShare> CategoryShares { get; set; }
    public DbSet<CategoryMonthConfig> CategoryMonthConfigs { get; set; }
    public DbSet<SavingsGoal> SavingsGoals { get; set; }
    public DbSet<UserMonthBudget> UserMonthBudgets { get; set; }
    public DbSet<FixedExpense> FixedExpenses { get; set; }
    public DbSet<FixedExpenseMonth> FixedExpenseMonths { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>()
            .HasOne(c => c.Owner)
            .WithMany()
            .HasForeignKey(c => c.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Expense>()
            .HasOne(e => e.Category)
            .WithMany(c => c.Expenses)
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CategoryShare>()
            .HasIndex(cs => new { cs.CategoryId, cs.SharedWithUserId })
            .IsUnique();

        modelBuilder.Entity<CategoryMonthConfig>()
            .HasOne(mc => mc.Category)
            .WithMany(c => c.MonthConfigs)
            .HasForeignKey(mc => mc.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CategoryMonthConfig>()
            .HasIndex(mc => new { mc.CategoryId, mc.Year, mc.Month })
            .IsUnique();

        modelBuilder.Entity<SavingsGoal>()
            .HasOne(g => g.User)
            .WithMany()
            .HasForeignKey(g => g.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SavingsGoal>()
            .HasIndex(g => g.UserId);

        modelBuilder.Entity<UserMonthBudget>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserMonthBudget>()
            .HasIndex(b => new { b.UserId, b.Year, b.Month })
            .IsUnique();

        modelBuilder.Entity<FixedExpense>()
            .HasOne(f => f.User)
            .WithMany()
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FixedExpense>()
            .Property(f => f.Name)
            .HasMaxLength(200);

        modelBuilder.Entity<FixedExpense>()
            .Property(f => f.Description)
            .HasMaxLength(500);

        modelBuilder.Entity<FixedExpenseMonth>()
            .HasOne(m => m.FixedExpense)
            .WithMany(f => f.Months)
            .HasForeignKey(m => m.FixedExpenseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FixedExpenseMonth>()
            .HasIndex(m => new { m.FixedExpenseId, m.Year, m.Month })
            .IsUnique();
    }
}
