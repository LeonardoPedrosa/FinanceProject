using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApp.Api.DTOs
{
    public class ExpenseResponseDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public Guid? InstallmentGroupId { get; set; }
        public int? InstallmentNumber { get; set; }
        public int? TotalInstallments { get; set; }
    }
}