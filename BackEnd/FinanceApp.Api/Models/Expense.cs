using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApp.Api.Models
{
    public class Expense
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? InstallmentGroupId { get; set; }
        public int? InstallmentNumber { get; set; }
        public int? TotalInstallments { get; set; }
    }
}