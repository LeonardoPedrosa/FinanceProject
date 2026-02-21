using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class CategoryMonthConfigRepository : Repository<CategoryMonthConfig>, ICategoryMonthConfigRepository
    {
        public CategoryMonthConfigRepository(ApplicationDbContext context) : base(context) { }

        public async Task<CategoryMonthConfig?> GetAsync(Guid categoryId, int year, int month)
        {
            return await _dbSet
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId && c.Year == year && c.Month == month);
        }

        public async Task<IEnumerable<CategoryMonthConfig>> GetByCategoryAsync(Guid categoryId)
        {
            return await _dbSet
                .Where(c => c.CategoryId == categoryId)
                .OrderByDescending(c => c.Year)
                .ThenByDescending(c => c.Month)
                .ToListAsync();
        }
    }
}
