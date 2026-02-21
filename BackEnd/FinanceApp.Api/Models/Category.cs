namespace FinanceApp.Api.Models
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public Guid OwnerId { get; set; }
        public User Owner { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<CategoryShare> Shares { get; set; } = new List<CategoryShare>();
        public ICollection<CategoryMonthConfig> MonthConfigs { get; set; } = new List<CategoryMonthConfig>();
    }
}