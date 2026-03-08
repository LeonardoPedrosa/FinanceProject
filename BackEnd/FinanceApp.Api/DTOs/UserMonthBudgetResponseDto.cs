namespace FinanceApp.Api.DTOs
{
    public class UserMonthBudgetResponseDto
    {
        public Guid Id { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalBudget { get; set; }
        public bool IsSet { get; set; }
        public decimal? PartnerTotalBudget { get; set; }
    }
}
