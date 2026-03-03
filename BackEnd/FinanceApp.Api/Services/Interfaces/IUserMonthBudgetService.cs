using FinanceApp.Api.DTOs;

namespace FinanceApp.Api.Services.Interfaces
{
    public interface IUserMonthBudgetService
    {
        Task<UserMonthBudgetResponseDto> GetAsync(Guid userId, int year, int month);
        Task<UserMonthBudgetResponseDto> UpsertAsync(Guid userId, int year, int month, UpsertUserMonthBudgetDto dto);
    }
}
