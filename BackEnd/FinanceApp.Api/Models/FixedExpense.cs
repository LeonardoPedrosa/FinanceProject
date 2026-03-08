namespace FinanceApp.Api.Models
{
    public class FixedExpense
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal DefaultAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<FixedExpenseMonth> Months { get; set; } = new List<FixedExpenseMonth>();
    }
}
