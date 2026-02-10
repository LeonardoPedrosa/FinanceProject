using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class CategoryShareRepository : Repository<CategoryShare>, ICategoryShareRepository
    {
        public CategoryShareRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<CategoryShare>> GetSharesByCategoryAsync(Guid categoryId)
        {
            return await _dbSet
                .Where(cs => cs.CategoryId == categoryId)
                .Include(cs => cs.SharedWithUser)
                .ToListAsync();
        }

        public async Task<CategoryShare?> GetShareAsync(Guid categoryId, Guid userId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(cs => cs.CategoryId == categoryId
                                        && cs.SharedWithUserId == userId);
        }

        public async Task<bool> IsSharedWithUserAsync(Guid categoryId, Guid userId)
        {
            return await _dbSet
                .AnyAsync(cs => cs.CategoryId == categoryId
                             && cs.SharedWithUserId == userId);
        }

        public async Task<IEnumerable<User>> GetSharedUsersAsync(Guid categoryId)
        {
            return await _dbSet
                .Where(cs => cs.CategoryId == categoryId)
                .Include(cs => cs.SharedWithUser)
                .Select(cs => cs.SharedWithUser)
                .ToListAsync();
        }
    }
}