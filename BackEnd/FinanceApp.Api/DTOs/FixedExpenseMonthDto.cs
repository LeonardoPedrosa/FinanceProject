namespace FinanceApp.Api.DTOs
{
    public class FixedExpenseMonthDto
    {
        public Guid Id { get; set; }
        public Guid FixedExpenseId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Amount { get; set; }
    }
}
