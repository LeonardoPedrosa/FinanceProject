using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface ICategoryMonthConfigRepository : IRepository<CategoryMonthConfig>
    {
        Task<CategoryMonthConfig?> GetAsync(Guid categoryId, int year, int month);
        Task<IEnumerable<CategoryMonthConfig>> GetByCategoryAsync(Guid categoryId);
    }
}
