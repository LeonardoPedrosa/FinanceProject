namespace FinanceApp.Api.DTOs
{
    public class SavingsGoalMonthSummaryDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal MonthlyBudget { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal AmountSaved { get; set; }
        public string Badge { get; set; } = string.Empty;
        public string BadgeLabel { get; set; } = string.Empty;
    }
}
