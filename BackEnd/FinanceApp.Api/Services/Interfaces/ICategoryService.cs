using FinanceApp.Api.DTOs;

namespace FinanceApp.Api.Services.Intefaces
{
    public interface ICategoryService
    {
        Task<List<CategoryResponseDto>> GetUserCategoriesAsync(Guid userId);
        Task<CategoryResponseDto> CreateCategoryAsync(Guid userId, CreateCategoryDto dto);
        Task<ExpenseResponseDto> AddExpenseAsync(Guid userId, Guid categoryId, CreateExpenseDto dto);
        Task ShareCategoryAsync(Guid userId, Guid categoryId, ShareCategoryDto dto);
        Task<CategoryStatusDto> GetCategoryStatusAsync(Guid categoryId);
    }
}