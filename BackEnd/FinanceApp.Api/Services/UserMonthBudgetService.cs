using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Models;
using FinanceApp.Api.Services.Interfaces;

namespace FinanceApp.Api.Services
{
    public class UserMonthBudgetService : IUserMonthBudgetService
    {
        private readonly IUserMonthBudgetRepository _repo;
        private readonly IUserConnectionRepository _connectionRepository;

        public UserMonthBudgetService(IUserMonthBudgetRepository repo, IUserConnectionRepository connectionRepository)
        {
            _repo = repo;
            _connectionRepository = connectionRepository;
        }

        public async Task<UserMonthBudgetResponseDto> GetAsync(Guid userId, int year, int month)
        {
            var budget = await _repo.GetAsync(userId, year, month);

            var dto = budget == null
                ? new UserMonthBudgetResponseDto { IsSet = false, TotalBudget = 0, Year = year, Month = month }
                : new UserMonthBudgetResponseDto { Id = budget.Id, Year = budget.Year, Month = budget.Month, TotalBudget = budget.TotalBudget, IsSet = true };

            var connections = await _connectionRepository.GetByReceiverIdAsync(userId);
            var firstSharer = connections.FirstOrDefault();
            if (firstSharer != null)
            {
                var partnerBudget = await _repo.GetAsync(firstSharer.SharerId, year, month);
                dto.PartnerTotalBudget = partnerBudget?.TotalBudget;
            }

            return dto;
        }

        public async Task<UserMonthBudgetResponseDto> UpsertAsync(Guid userId, int year, int month, UpsertUserMonthBudgetDto dto)
        {
            var existing = await _repo.GetAsync(userId, year, month);

            if (existing == null)
            {
                existing = new UserMonthBudget
                {
                    UserId = userId,
                    Year = year,
                    Month = month,
                    TotalBudget = dto.TotalBudget,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _repo.AddAsync(existing);
            }
            else
            {
                existing.TotalBudget = dto.TotalBudget;
                existing.UpdatedAt = DateTime.UtcNow;
                _repo.Update(existing);
            }

            await _repo.SaveChangesAsync();

            return new UserMonthBudgetResponseDto
            {
                Id = existing.Id,
                Year = existing.Year,
                Month = existing.Month,
                TotalBudget = existing.TotalBudget,
                IsSet = true
            };
        }
    }
}
