using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Api.DTOs
{
    public class UpdateFixedExpenseMonthAmountDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }
    }
}
