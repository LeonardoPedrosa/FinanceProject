using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Api.DTOs
{
    public class CreateUserConnectionDto
    {
        [Required]
        [EmailAddress]
        public string ReceiverEmail { get; set; } = string.Empty;
    }
}
