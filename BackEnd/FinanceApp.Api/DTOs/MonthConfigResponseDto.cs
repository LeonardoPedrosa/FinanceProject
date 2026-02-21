namespace FinanceApp.Api.DTOs
{
    public class MonthConfigResponseDto
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal MaxValue { get; set; }
        public bool IsConfigured { get; set; }
    }
}
