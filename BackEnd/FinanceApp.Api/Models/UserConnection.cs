namespace FinanceApp.Api.Models
{
    public class UserConnection
    {
        public Guid Id { get; set; }
        public Guid SharerId { get; set; }
        public User Sharer { get; set; } = null!;
        public Guid ReceiverId { get; set; }
        public User Receiver { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
