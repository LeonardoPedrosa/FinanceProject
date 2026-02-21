namespace FinanceApp.Api.Models
{
    public class CategoryMonthConfig
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal MaxValue { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
