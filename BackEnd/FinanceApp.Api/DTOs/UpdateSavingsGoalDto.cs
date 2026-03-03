namespace FinanceApp.Api.DTOs
{
    public class UpdateSavingsGoalDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal TotalTargetAmount { get; set; }
        public decimal MonthlyBudget { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int DurationMonths { get; set; }
        public string Status { get; set; } = "Active";
    }
}
