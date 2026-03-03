using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface IUserMonthBudgetRepository : IRepository<UserMonthBudget>
    {
        Task<UserMonthBudget?> GetAsync(Guid userId, int year, int month);
    }
}
