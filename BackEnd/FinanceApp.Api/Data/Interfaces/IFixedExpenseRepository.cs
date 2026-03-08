using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface IFixedExpenseRepository : IRepository<FixedExpense>
    {
        Task<IEnumerable<FixedExpense>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<FixedExpense>> GetByUserIdsAsync(IReadOnlyCollection<Guid> userIds);
        Task<FixedExpense?> GetByIdWithMonthsAsync(Guid id);
    }
}
