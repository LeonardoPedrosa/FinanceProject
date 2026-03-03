using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Api.DTOs
{
    public class UpsertUserMonthBudgetDto
    {
        [Required]
        [Range(0.01, 999999999.99, ErrorMessage = "Total budget must be greater than zero")]
        public decimal TotalBudget { get; set; }
    }
}
