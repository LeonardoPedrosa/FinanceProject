namespace FinanceApp.Api.DTOs
{
    public class CategoryStatusDto
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal MaxValue { get; set; }
        public decimal CurrentValue { get; set; }
        public bool IsOverLimit { get; set; }
        public decimal Percentage { get; set; }
    }
}