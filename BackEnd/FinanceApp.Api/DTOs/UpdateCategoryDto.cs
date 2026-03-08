using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Api.DTOs
{
    public class UpdateCategoryDto
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Icon is required")]
        [StringLength(50, ErrorMessage = "Icon must not exceed 50 characters")]
        public string Icon { get; set; } = string.Empty;

        [Required(ErrorMessage = "Color is required")]
        [RegularExpression("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            ErrorMessage = "Color must be a valid hex color (e.g., #FF5733)")]
        public string Color { get; set; } = string.Empty;

        public bool IsPrivate { get; set; } = false;
    }
}
