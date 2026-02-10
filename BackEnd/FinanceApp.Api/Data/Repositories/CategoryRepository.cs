using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Category>> GetUserCategoriesAsync(Guid userId)
        {
            return await _dbSet
                .Where(c => c.OwnerId == userId)
                .Include(c => c.Expenses)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetSharedCategoriesAsync(Guid userId)
        {
            return await _context.CategoryShares
                .Where(cs => cs.SharedWithUserId == userId)
                .Include(cs => cs.Category)
                .ThenInclude(c => c.Expenses)
                .Select(cs => cs.Category)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<Category?> GetCategoryWithExpensesAsync(Guid categoryId)
        {
            return await _dbSet
                .Include(c => c.Expenses)
                .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(c => c.Id == categoryId);
        }

        public async Task<Category?> GetCategoryWithSharesAsync(Guid categoryId)
        {
            return await _dbSet
                .Include(c => c.Shares)
                .ThenInclude(s => s.SharedWithUser)
                .FirstOrDefaultAsync(c => c.Id == categoryId);
        }

        public async Task<bool> UserHasAccessAsync(Guid userId, Guid categoryId)
        {
            var category = await _dbSet.FindAsync(categoryId);

            if (category == null)
                return false;

            if (category.OwnerId == userId)
                return true;

            return await _context.CategoryShares
                .AnyAsync(cs => cs.CategoryId == categoryId && cs.SharedWithUserId == userId);
        }

        public async Task<decimal> GetCategoryTotalExpensesAsync(Guid categoryId)
        {
            return await _context.Expenses
                .Where(e => e.CategoryId == categoryId)
                .SumAsync(e => e.Amount);
        }
    }
}