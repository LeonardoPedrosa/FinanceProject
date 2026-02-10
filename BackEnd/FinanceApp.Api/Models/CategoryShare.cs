using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApp.Api.Models
{
    public class CategoryShare
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public Guid SharedWithUserId { get; set; }
        public User SharedWithUser { get; set; } = null!;
        public bool CanEdit { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}