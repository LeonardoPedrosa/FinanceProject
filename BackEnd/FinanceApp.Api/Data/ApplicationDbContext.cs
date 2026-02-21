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
    }
}
