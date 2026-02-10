using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApp.Api.DTOs
{
    public class CreateExpenseDto
    {
        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, 999999999.99, ErrorMessage = "Amount must be between 0.01 and 999,999,999.99")]
        public decimal Amount { get; set; }

        [StringLength(500, ErrorMessage = "Description must not exceed 500 characters")]
        public string? Description { get; set; }
    }
}