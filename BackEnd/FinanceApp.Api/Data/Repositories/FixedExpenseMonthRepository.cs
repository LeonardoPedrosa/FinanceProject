using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class FixedExpenseMonthRepository : Repository<FixedExpenseMonth>, IFixedExpenseMonthRepository
    {
        public FixedExpenseMonthRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<FixedExpenseMonth>> GetByFixedExpenseIdAsync(Guid fixedExpenseId)
        {
            return await _dbSet
                .Where(m => m.FixedExpenseId == fixedExpenseId)
                .OrderBy(m => m.Year)
                .ThenBy(m => m.Month)
                .ToListAsync();
        }

        public async Task<IEnumerable<FixedExpenseMonth>> GetByUserMonthAsync(Guid userId, int year, int month)
        {
            return await _dbSet
                .Where(m => m.FixedExpense.UserId == userId && m.Year == year && m.Month == month)
                .Include(m => m.FixedExpense)
                .ToListAsync();
        }

        public async Task<FixedExpenseMonth?> GetByFixedExpenseAndMonthAsync(Guid fixedExpenseId, int year, int month)
        {
            return await _dbSet
                .FirstOrDefaultAsync(m => m.FixedExpenseId == fixedExpenseId && m.Year == year && m.Month == month);
        }

        public async Task<IEnumerable<FixedExpenseMonth>> GetByUserIdsMonthAsync(IEnumerable<Guid> userIds, int year, int month)
        {
            return await _dbSet
                .Where(m => userIds.Contains(m.FixedExpense.UserId) && m.Year == year && m.Month == month)
                .Include(m => m.FixedExpense)
                .ToListAsync();
        }
    }
}
