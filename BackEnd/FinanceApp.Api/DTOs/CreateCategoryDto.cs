using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApp.Api.DTOs
{
    public class CreateCategoryDto
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Icon is required")]
        [StringLength(50, ErrorMessage = "Icon must not exceed 50 characters")]
        public string Icon { get; set; } = string.Empty;

        [Required(ErrorMessage = "Color is required")]
        [RegularExpression("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Color must be a valid hex color (e.g., #FF5733)")]
        public string Color { get; set; } = string.Empty;

        [Required(ErrorMessage = "Max value is required")]
        [Range(0.01, 999999999.99, ErrorMessage = "Max value must be between 0.01 and 999,999,999.99")]
        public decimal MaxValue { get; set; }

        [Range(2020, 2100, ErrorMessage = "Year must be between 2020 and 2100")]
        public int? Year { get; set; }

        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12")]
        public int? Month { get; set; }

        public bool IsPrivate { get; set; } = false;
    }
}