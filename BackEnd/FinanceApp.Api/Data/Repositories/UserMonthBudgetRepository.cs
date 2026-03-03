using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class UserMonthBudgetRepository : Repository<UserMonthBudget>, IUserMonthBudgetRepository
    {
        public UserMonthBudgetRepository(ApplicationDbContext context) : base(context) { }

        public async Task<UserMonthBudget?> GetAsync(Guid userId, int year, int month)
        {
            return await _dbSet
                .FirstOrDefaultAsync(b => b.UserId == userId && b.Year == year && b.Month == month);
        }
    }
}
