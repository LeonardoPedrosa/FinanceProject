using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<IEnumerable<Category>> GetUserCategoriesAsync(Guid userId, int year, int month);
        Task<IEnumerable<Category>> GetSharedCategoriesAsync(Guid userId, int year, int month);
        Task<Category?> GetCategoryWithExpensesAsync(Guid categoryId);
        Task<Category?> GetCategoryWithSharesAsync(Guid categoryId);
        Task<bool> UserHasAccessAsync(Guid userId, Guid categoryId);
        Task<decimal> GetCategoryTotalExpensesAsync(Guid categoryId);
    }
}