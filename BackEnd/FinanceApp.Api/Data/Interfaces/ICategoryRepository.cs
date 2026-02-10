using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<IEnumerable<Category>> GetUserCategoriesAsync(Guid userId);
        Task<IEnumerable<Category>> GetSharedCategoriesAsync(Guid userId);
        Task<Category?> GetCategoryWithExpensesAsync(Guid categoryId);
        Task<Category?> GetCategoryWithSharesAsync(Guid categoryId);
        Task<bool> UserHasAccessAsync(Guid userId, Guid categoryId);
        Task<decimal> GetCategoryTotalExpensesAsync(Guid categoryId);
    }
}