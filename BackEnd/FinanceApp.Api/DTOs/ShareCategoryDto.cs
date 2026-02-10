using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Api.DTOs
{
    public class ShareCategoryDto
    {
        [Required(ErrorMessage = "User email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string UserEmail { get; set; } = string.Empty;

        public bool CanEdit { get; set; } = false;
    }
}