using FinanceApp.Api.DTOs;

namespace FinanceApp.Api.Services.Interfaces
{
    public interface IFixedExpenseService
    {
        Task<List<FixedExpenseResponseDto>> GetAllAsync(Guid userId, int year, int month);
        Task<FixedExpenseResponseDto> GetByIdAsync(Guid userId, Guid id);
        Task<decimal> GetMonthTotalAsync(Guid userId, int year, int month);
        Task<FixedExpenseResponseDto> CreateAsync(Guid userId, CreateFixedExpenseDto dto);
        Task<FixedExpenseResponseDto> UpdateAsync(Guid userId, Guid id, UpdateFixedExpenseDto dto);
        Task DeleteAsync(Guid userId, Guid id);
        Task UpdateMonthAmountAsync(Guid userId, Guid id, int year, int month, UpdateFixedExpenseMonthAmountDto dto);
    }
}
