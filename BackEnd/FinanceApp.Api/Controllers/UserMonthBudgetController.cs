using System.Security.Claims;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user-month-budget")]
    public class UserMonthBudgetController : ControllerBase
    {
        private readonly IUserMonthBudgetService _service;

        public UserMonthBudgetController(IUserMonthBudgetService service)
        {
            _service = service;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<UserMonthBudgetResponseDto>> Get([FromQuery] int year, [FromQuery] int month)
        {
            var result = await _service.GetAsync(GetUserId(), year, month);
            return Ok(result);
        }

        [HttpPut]
        public async Task<ActionResult<UserMonthBudgetResponseDto>> Upsert(
            [FromQuery] int year,
            [FromQuery] int month,
            [FromBody] UpsertUserMonthBudgetDto dto)
        {
            var result = await _service.UpsertAsync(GetUserId(), year, month, dto);
            return Ok(result);
        }
    }
}
