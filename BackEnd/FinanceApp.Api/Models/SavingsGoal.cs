namespace FinanceApp.Api.Models
{
    public class SavingsGoal
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal TotalTargetAmount { get; set; }
        public decimal MonthlyBudget { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int DurationMonths { get; set; }
        public string Status { get; set; } = "Active"; // Active | Completed | Paused
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
