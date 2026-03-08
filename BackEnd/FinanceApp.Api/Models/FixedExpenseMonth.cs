namespace FinanceApp.Api.Models
{
    public class FixedExpenseMonth
    {
        public Guid Id { get; set; }
        public Guid FixedExpenseId { get; set; }
        public FixedExpense FixedExpense { get; set; } = null!;
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
