using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Api.DTOs
{
    public class UpdateCategoryDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Icon { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")]
        public string Color { get; set; } = string.Empty;
    }
}
