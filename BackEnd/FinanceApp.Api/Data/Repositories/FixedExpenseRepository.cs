using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class FixedExpenseRepository : Repository<FixedExpense>, IFixedExpenseRepository
    {
        public FixedExpenseRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<FixedExpense>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet
                .Where(f => f.UserId == userId)
                .Include(f => f.Months)
                .OrderBy(f => f.Name)
                .ToListAsync();
        }

        public async Task<FixedExpense?> GetByIdWithMonthsAsync(Guid id)
        {
            return await _dbSet
                .Include(f => f.Months)
                .FirstOrDefaultAsync(f => f.Id == id);
        }
    }
}
