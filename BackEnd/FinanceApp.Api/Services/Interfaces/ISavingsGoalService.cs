using FinanceApp.Api.DTOs;

namespace FinanceApp.Api.Services.Interfaces
{
    public interface ISavingsGoalService
    {
        Task<List<SavingsGoalResponseDto>> GetAllAsync(Guid userId);
        Task<SavingsGoalResponseDto> GetByIdAsync(Guid userId, Guid goalId);
        Task<SavingsGoalResponseDto> CreateAsync(Guid userId, CreateSavingsGoalDto dto);
        Task<SavingsGoalResponseDto> UpdateAsync(Guid userId, Guid goalId, UpdateSavingsGoalDto dto);
        Task DeleteAsync(Guid userId, Guid goalId);
    }
}
