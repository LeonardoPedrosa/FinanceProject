using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user-month-budget")]
    public class UserMonthBudgetController : ControllerBase
    {
        private readonly IUserMonthBudgetRepository _repo;

        public UserMonthBudgetController(IUserMonthBudgetRepository repo)
        {
            _repo = repo;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<UserMonthBudgetResponseDto>> Get([FromQuery] int year, [FromQuery] int month)
        {
            var userId = GetUserId();
            var budget = await _repo.GetAsync(userId, year, month);

            if (budget == null)
                return Ok(new UserMonthBudgetResponseDto { IsSet = false, TotalBudget = 0, Year = year, Month = month });

            return Ok(new UserMonthBudgetResponseDto
            {
                Id = budget.Id,
                Year = budget.Year,
                Month = budget.Month,
                TotalBudget = budget.TotalBudget,
                IsSet = true
            });
        }

        [HttpPut]
        public async Task<ActionResult<UserMonthBudgetResponseDto>> Upsert(
            [FromQuery] int year,
            [FromQuery] int month,
            [FromBody] UpsertUserMonthBudgetDto dto)
        {
            var userId = GetUserId();
            var existing = await _repo.GetAsync(userId, year, month);

            if (existing == null)
            {
                existing = new UserMonthBudget
                {
                    Id = Guid.NewGuid(),
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

            return Ok(new UserMonthBudgetResponseDto
            {
                Id = existing.Id,
                Year = existing.Year,
                Month = existing.Month,
                TotalBudget = existing.TotalBudget,
                IsSet = true
            });
        }
    }
}
