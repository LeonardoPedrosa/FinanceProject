using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApp.Api.DTOs
{
    public class CategoryResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public decimal MaxValue { get; set; }
        public decimal CurrentValue { get; set; }
        public bool IsOverLimit { get; set; }
        public bool IsOwner { get; set; }

    }
}