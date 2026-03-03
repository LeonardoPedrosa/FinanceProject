using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface ISavingsGoalRepository : IRepository<SavingsGoal>
    {
        Task<IEnumerable<SavingsGoal>> GetByUserIdAsync(Guid userId);
    }
}
