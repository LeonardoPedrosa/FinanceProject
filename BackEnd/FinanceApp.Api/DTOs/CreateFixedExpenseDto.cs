using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Api.DTOs
{
    public class CreateFixedExpenseDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "DefaultAmount must be greater than 0")]
        public decimal DefaultAmount { get; set; }
    }
}
