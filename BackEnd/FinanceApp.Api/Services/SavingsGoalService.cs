using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Models;
using FinanceApp.Api.Services.Interfaces;

namespace FinanceApp.Api.Services
{
    public class SavingsGoalService : ISavingsGoalService
    {
        private readonly ISavingsGoalRepository _goalRepository;
        private readonly IExpenseRepository _expenseRepository;

        public SavingsGoalService(ISavingsGoalRepository goalRepository, IExpenseRepository expenseRepository)
        {
            _goalRepository = goalRepository;
            _expenseRepository = expenseRepository;
        }

        public async Task<List<SavingsGoalResponseDto>> GetAllAsync(Guid userId)
        {
            var goals = await _goalRepository.GetByUserIdAsync(userId);
            var result = new List<SavingsGoalResponseDto>();
            foreach (var goal in goals)
                result.Add(await BuildResponseDtoAsync(goal));
            return result;
        }

        public async Task<SavingsGoalResponseDto> GetByIdAsync(Guid userId, Guid goalId)
        {
            var goal = await _goalRepository.GetByIdAsync(goalId);
            if (goal == null) throw new Exception("Goal not found");
            if (goal.UserId != userId) throw new UnauthorizedAccessException("Access denied");
            return await BuildResponseDtoAsync(goal);
        }

        public async Task<SavingsGoalResponseDto> CreateAsync(Guid userId, CreateSavingsGoalDto dto)
        {
            var goal = new SavingsGoal
            {
                UserId = userId,
                Name = dto.Name,
                Description = dto.Description,
                TotalTargetAmount = dto.TotalTargetAmount,
                MonthlyBudget = dto.MonthlyBudget,
                StartYear = dto.StartYear,
                StartMonth = dto.StartMonth,
                DurationMonths = dto.DurationMonths,
                Status = "Active"
            };
            await _goalRepository.AddAsync(goal);
            await _goalRepository.SaveChangesAsync();
            return await BuildResponseDtoAsync(goal);
        }

        public async Task<SavingsGoalResponseDto> UpdateAsync(Guid userId, Guid goalId, UpdateSavingsGoalDto dto)
        {
            var goal = await _goalRepository.GetByIdAsync(goalId);
            if (goal == null) throw new Exception("Goal not found");
            if (goal.UserId != userId) throw new UnauthorizedAccessException("Access denied");

            goal.Name = dto.Name;
            goal.Description = dto.Description;
            goal.TotalTargetAmount = dto.TotalTargetAmount;
            goal.MonthlyBudget = dto.MonthlyBudget;
            goal.StartYear = dto.StartYear;
            goal.StartMonth = dto.StartMonth;
            goal.DurationMonths = dto.DurationMonths;
            goal.Status = dto.Status;
            goal.UpdatedAt = DateTime.UtcNow;

            _goalRepository.Update(goal);
            await _goalRepository.SaveChangesAsync();
            return await BuildResponseDtoAsync(goal);
        }

        public async Task DeleteAsync(Guid userId, Guid goalId)
        {
            var goal = await _goalRepository.GetByIdAsync(goalId);
            if (goal == null) throw new Exception("Goal not found");
            if (goal.UserId != userId) throw new UnauthorizedAccessException("Access denied");

            _goalRepository.Delete(goal);
            await _goalRepository.SaveChangesAsync();
        }

        private async Task<SavingsGoalResponseDto> BuildResponseDtoAsync(SavingsGoal goal)
        {
            var now = DateTime.UtcNow;
            var currentPeriod = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var summaries = new List<SavingsGoalMonthSummaryDto>();

            for (int i = 0; i < goal.DurationMonths; i++)
            {
                var date = new DateTime(goal.StartYear, goal.StartMonth, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(i);
                if (date > currentPeriod) break; // Skip future months

                var totalExpenses = await _expenseRepository.GetTotalByUserMonthAsync(goal.UserId, date.Year, date.Month);
                var amountSaved = goal.MonthlyBudget - totalExpenses;
                var (badge, label) = ComputeBadge(amountSaved, goal.MonthlyBudget);

                summaries.Add(new SavingsGoalMonthSummaryDto
                {
                    Year = date.Year,
                    Month = date.Month,
                    MonthlyBudget = goal.MonthlyBudget,
                    TotalExpenses = totalExpenses,
                    AmountSaved = amountSaved,
                    Badge = badge,
                    BadgeLabel = label
                });
            }

            var totalSaved = summaries.Where(s => s.AmountSaved > 0).Sum(s => s.AmountSaved);
            var progressPercent = goal.TotalTargetAmount > 0
                ? Math.Min((totalSaved / goal.TotalTargetAmount) * 100, 100)
                : 0;

            return new SavingsGoalResponseDto
            {
                Id = goal.Id,
                UserId = goal.UserId,
                Name = goal.Name,
                Description = goal.Description,
                TotalTargetAmount = goal.TotalTargetAmount,
                MonthlyBudget = goal.MonthlyBudget,
                StartYear = goal.StartYear,
                StartMonth = goal.StartMonth,
                DurationMonths = goal.DurationMonths,
                Status = goal.Status,
                TotalSaved = totalSaved,
                ProgressPercent = progressPercent,
                MonthSummaries = summaries,
                CreatedAt = goal.CreatedAt
            };
        }

        private static (string badge, string label) ComputeBadge(decimal amountSaved, decimal monthlyBudget)
        {
            if (monthlyBudget <= 0 || amountSaved < 0) return ("😅", "Over Budget");
            var pct = (amountSaved / monthlyBudget) * 100;
            if (pct >= 100) return ("💎", "Perfect Month!");
            if (pct >= 80) return ("🏆", "Champion Saver");
            if (pct >= 60) return ("💰", "Gold Saver");
            if (pct >= 40) return ("🌟", "Silver Saver");
            if (pct >= 20) return ("⭐", "Bronze Saver");
            return ("🌱", "Seedling Saver");
        }
    }
}
