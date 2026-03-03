using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class ExpenseRepository : Repository<Expense>, IExpenseRepository
    {
        public ExpenseRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Expense>> GetByCategoryIdAsync(Guid categoryId)
        {
            return await _dbSet
                .Where(e => e.CategoryId == categoryId)
                .Include(e => e.User)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Expense>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet
                .Where(e => e.UserId == userId)
                .Include(e => e.Category)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Expense>> GetByDateRangeAsync(Guid categoryId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(e => e.CategoryId == categoryId
                         && e.CreatedAt >= startDate
                         && e.CreatedAt <= endDate)
                .Include(e => e.User)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<Expense?> GetExpenseWithDetailsAsync(Guid expenseId)
        {
            return await _dbSet
                .Include(e => e.Category)
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == expenseId);
        }

        public async Task<decimal> GetTotalByCategoryAsync(Guid categoryId)
        {
            return await _dbSet
                .Where(e => e.CategoryId == categoryId)
                .SumAsync(e => e.Amount);
        }

        public async Task<decimal> GetTotalByUserMonthAsync(Guid userId, int year, int month)
        {
            var startDate = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            var endDate = startDate.AddMonths(1);
            return await _dbSet
                .Where(e => e.UserId == userId && e.CreatedAt >= startDate && e.CreatedAt < endDate)
                .SumAsync(e => e.Amount);
        }
    }
}