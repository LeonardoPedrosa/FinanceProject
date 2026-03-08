using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface IFixedExpenseMonthRepository : IRepository<FixedExpenseMonth>
    {
        Task<IEnumerable<FixedExpenseMonth>> GetByFixedExpenseIdAsync(Guid fixedExpenseId);
        Task<IEnumerable<FixedExpenseMonth>> GetByUserMonthAsync(Guid userId, int year, int month);
        Task<FixedExpenseMonth?> GetByFixedExpenseAndMonthAsync(Guid fixedExpenseId, int year, int month);
        Task<IEnumerable<FixedExpenseMonth>> GetByUserIdsMonthAsync(IReadOnlyCollection<Guid> userIds, int year, int month);
    }
}
