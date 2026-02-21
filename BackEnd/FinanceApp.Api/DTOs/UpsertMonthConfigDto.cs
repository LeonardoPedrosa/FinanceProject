using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Api.DTOs
{
    public class UpsertMonthConfigDto
    {
        [Required]
        [Range(2020, 2100, ErrorMessage = "Year must be between 2020 and 2100")]
        public int Year { get; set; }

        [Required]
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12")]
        public int Month { get; set; }

        [Required]
        [Range(0.01, 999999999.99, ErrorMessage = "Max value must be between 0.01 and 999,999,999.99")]
        public decimal MaxValue { get; set; }
    }
}
