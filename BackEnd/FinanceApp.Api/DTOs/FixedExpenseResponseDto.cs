namespace FinanceApp.Api.DTOs
{
    public class FixedExpenseResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal DefaultAmount { get; set; }
        public decimal CurrentMonthAmount { get; set; }
        public List<FixedExpenseMonthDto> Months { get; set; } = new();
        public string? OwnerName { get; set; }
    }
}
