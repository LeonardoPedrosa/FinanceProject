using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface ICategoryShareRepository: IRepository<CategoryShare>
    {
        Task<IEnumerable<CategoryShare>> GetSharesByCategoryAsync(Guid categoryId);
        Task<CategoryShare?> GetShareAsync(Guid categoryId, Guid userId);
        Task<bool> IsSharedWithUserAsync(Guid categoryId, Guid userId);
        Task<IEnumerable<User>> GetSharedUsersAsync(Guid categoryId);
    }
}