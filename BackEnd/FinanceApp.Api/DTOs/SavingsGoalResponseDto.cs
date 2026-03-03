namespace FinanceApp.Api.DTOs
{
    public class SavingsGoalResponseDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal TotalTargetAmount { get; set; }
        public decimal MonthlyBudget { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int DurationMonths { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalSaved { get; set; }
        public decimal ProgressPercent { get; set; }
        public List<SavingsGoalMonthSummaryDto> MonthSummaries { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}
