namespace FinanceApp.Api.DTOs
{
    public class MyConnectionResponseDto
    {
        public Guid ConnectionId { get; set; }
        public Guid PartnerId { get; set; }
        public string PartnerName { get; set; } = string.Empty;
        public string PartnerEmail { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
