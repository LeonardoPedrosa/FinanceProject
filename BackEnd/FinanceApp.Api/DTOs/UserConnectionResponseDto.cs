namespace FinanceApp.Api.DTOs
{
    public class UserConnectionResponseDto
    {
        public Guid Id { get; set; }
        public Guid SharerId { get; set; }
        public string SharerName { get; set; } = string.Empty;
        public string SharerEmail { get; set; } = string.Empty;
        public Guid ReceiverId { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverEmail { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
