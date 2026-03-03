using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface IExpenseRepository: IRepository<Expense>
    {
        Task<IEnumerable<Expense>> GetByCategoryIdAsync(Guid categoryId);
        Task<IEnumerable<Expense>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<Expense>> GetByDateRangeAsync(Guid categoryId, DateTime startDate, DateTime endDate);
        Task<Expense?> GetExpenseWithDetailsAsync(Guid expenseId);
        Task<decimal> GetTotalByCategoryAsync(Guid categoryId);
        Task<decimal> GetTotalByUserMonthAsync(Guid userId, int year, int month);
    }
}