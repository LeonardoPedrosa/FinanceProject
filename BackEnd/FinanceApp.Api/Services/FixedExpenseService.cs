using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Models;
using FinanceApp.Api.Services.Interfaces;

namespace FinanceApp.Api.Services
{
    public class FixedExpenseService : IFixedExpenseService
    {
        private readonly IFixedExpenseRepository _fixedExpenseRepository;
        private readonly IFixedExpenseMonthRepository _fixedExpenseMonthRepository;

        public FixedExpenseService(
            IFixedExpenseRepository fixedExpenseRepository,
            IFixedExpenseMonthRepository fixedExpenseMonthRepository)
        {
            _fixedExpenseRepository = fixedExpenseRepository;
            _fixedExpenseMonthRepository = fixedExpenseMonthRepository;
        }

        public async Task<List<FixedExpenseResponseDto>> GetAllAsync(Guid userId, int year, int month)
        {
            var expenses = await _fixedExpenseRepository.GetByUserIdAsync(userId);
            return expenses.Select(e => MapToDto(e, year, month)).ToList();
        }

        public async Task<FixedExpenseResponseDto> GetByIdAsync(Guid userId, Guid id)
        {
            var expense = await _fixedExpenseRepository.GetByIdWithMonthsAsync(id);
            if (expense == null) throw new Exception("Fixed expense not found");
            if (expense.UserId != userId) throw new UnauthorizedAccessException("Access denied");

            var now = DateTime.UtcNow;
            return MapToDto(expense, now.Year, now.Month);
        }

        public async Task<decimal> GetMonthTotalAsync(Guid userId, int year, int month)
        {
            var months = await _fixedExpenseMonthRepository.GetByUserMonthAsync(userId, year, month);
            return months.Sum(m => m.Amount);
        }

        public async Task<FixedExpenseResponseDto> CreateAsync(Guid userId, CreateFixedExpenseDto dto)
        {
            var expense = new FixedExpense
            {
                UserId = userId,
                Name = dto.Name,
                Description = dto.Description,
                DefaultAmount = dto.DefaultAmount
            };

            await _fixedExpenseRepository.AddAsync(expense);
            await _fixedExpenseRepository.SaveChangesAsync();

            // Generate months from current month to December of current year
            var now = DateTime.UtcNow;
            var months = new List<FixedExpenseMonth>();
            for (int m = now.Month; m <= 12; m++)
            {
                months.Add(new FixedExpenseMonth
                {
                    FixedExpenseId = expense.Id,
                    Year = now.Year,
                    Month = m,
                    Amount = dto.DefaultAmount
                });
            }

            foreach (var month in months)
                await _fixedExpenseMonthRepository.AddAsync(month);

            await _fixedExpenseMonthRepository.SaveChangesAsync();

            expense.Months = months;
            return MapToDto(expense, now.Year, now.Month);
        }

        public async Task<FixedExpenseResponseDto> UpdateAsync(Guid userId, Guid id, UpdateFixedExpenseDto dto)
        {
            var expense = await _fixedExpenseRepository.GetByIdWithMonthsAsync(id);
            if (expense == null) throw new Exception("Fixed expense not found");
            if (expense.UserId != userId) throw new UnauthorizedAccessException("Access denied");

            expense.Name = dto.Name;
            expense.Description = dto.Description;
            expense.DefaultAmount = dto.DefaultAmount;

            _fixedExpenseRepository.Update(expense);
            await _fixedExpenseRepository.SaveChangesAsync();

            var now = DateTime.UtcNow;
            return MapToDto(expense, now.Year, now.Month);
        }

        public async Task DeleteAsync(Guid userId, Guid id)
        {
            var expense = await _fixedExpenseRepository.GetByIdAsync(id);
            if (expense == null) throw new Exception("Fixed expense not found");
            if (expense.UserId != userId) throw new UnauthorizedAccessException("Access denied");

            // Cascade delete handles FixedExpenseMonths
            _fixedExpenseRepository.Delete(expense);
            await _fixedExpenseRepository.SaveChangesAsync();
        }

        public async Task UpdateMonthAmountAsync(Guid userId, Guid id, int year, int month, UpdateFixedExpenseMonthAmountDto dto)
        {
            var expense = await _fixedExpenseRepository.GetByIdAsync(id);
            if (expense == null) throw new Exception("Fixed expense not found");
            if (expense.UserId != userId) throw new UnauthorizedAccessException("Access denied");

            var monthRecord = await _fixedExpenseMonthRepository.GetByFixedExpenseAndMonthAsync(id, year, month);
            if (monthRecord == null) throw new Exception("Month record not found");

            monthRecord.Amount = dto.Amount;
            monthRecord.UpdatedAt = DateTime.UtcNow;

            _fixedExpenseMonthRepository.Update(monthRecord);
            await _fixedExpenseMonthRepository.SaveChangesAsync();
        }

        private static FixedExpenseResponseDto MapToDto(FixedExpense expense, int year, int month)
        {
            var months = expense.Months
                .OrderBy(m => m.Year)
                .ThenBy(m => m.Month)
                .Select(m => new FixedExpenseMonthDto
                {
                    Id = m.Id,
                    FixedExpenseId = m.FixedExpenseId,
                    Year = m.Year,
                    Month = m.Month,
                    Amount = m.Amount
                })
                .ToList();

            var currentMonth = expense.Months.FirstOrDefault(m => m.Year == year && m.Month == month);

            return new FixedExpenseResponseDto
            {
                Id = expense.Id,
                Name = expense.Name,
                Description = expense.Description,
                DefaultAmount = expense.DefaultAmount,
                CurrentMonthAmount = currentMonth?.Amount ?? expense.DefaultAmount,
                Months = months
            };
        }
    }
}
