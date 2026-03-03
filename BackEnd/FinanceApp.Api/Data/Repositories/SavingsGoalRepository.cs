using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class SavingsGoalRepository : Repository<SavingsGoal>, ISavingsGoalRepository
    {
        public SavingsGoalRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<SavingsGoal>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();
        }
    }
}
