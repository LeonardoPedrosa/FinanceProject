using FinanceApp.Api.DTOs;

namespace FinanceApp.Api.Services.Intefaces
{
    public interface ICategoryService
    {
        Task<List<CategoryResponseDto>> GetUserCategoriesAsync(Guid userId, int year, int month);
        Task<CategoryResponseDto> CreateCategoryAsync(Guid userId, CreateCategoryDto dto);
        Task<ExpenseResponseDto> AddExpenseAsync(Guid userId, Guid categoryId, CreateExpenseDto dto);
        Task ShareCategoryAsync(Guid userId, Guid categoryId, ShareCategoryDto dto);
        Task<CategoryStatusDto> GetCategoryStatusAsync(Guid categoryId, int year, int month);
        Task<MonthConfigResponseDto> UpsertMonthConfigAsync(Guid userId, Guid categoryId, UpsertMonthConfigDto dto);
        Task<MonthConfigResponseDto> GetMonthConfigAsync(Guid userId, Guid categoryId, int year, int month);
        Task<List<ExpenseResponseDto>> GetCategoryExpensesAsync(Guid userId, Guid categoryId, int year, int month);
        Task<ExpenseResponseDto> UpdateExpenseAsync(Guid userId, Guid categoryId, Guid expenseId, UpdateExpenseDto dto);
        Task DeleteExpenseAsync(Guid userId, Guid categoryId, Guid expenseId);
        Task<CategoryResponseDto> UpdateCategoryAsync(Guid userId, Guid categoryId, UpdateCategoryDto dto);
    }
}