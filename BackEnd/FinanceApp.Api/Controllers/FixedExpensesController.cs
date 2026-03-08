using FinanceApp.Api.DTOs;
using FinanceApp.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/fixed-expenses")]
    public class FixedExpensesController : ControllerBase
    {
        private readonly IFixedExpenseService _service;

        public FixedExpensesController(IFixedExpenseService service)
        {
            _service = service;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<List<FixedExpenseResponseDto>>> GetAll(
            [FromQuery] int year,
            [FromQuery] int month)
        {
            var result = await _service.GetAllAsync(GetUserId(), year, month);
            return Ok(result);
        }

        [HttpGet("total")]
        public async Task<ActionResult> GetTotal([FromQuery] int year, [FromQuery] int month)
        {
            var total = await _service.GetMonthTotalAsync(GetUserId(), year, month);
            return Ok(new { total });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FixedExpenseResponseDto>> GetById(Guid id)
        {
            try
            {
                var result = await _service.GetByIdAsync(GetUserId(), id);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex) when (ex.Message == "Fixed expense not found")
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<FixedExpenseResponseDto>> Create(CreateFixedExpenseDto dto)
        {
            var result = await _service.CreateAsync(GetUserId(), dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FixedExpenseResponseDto>> Update(Guid id, UpdateFixedExpenseDto dto)
        {
            try
            {
                var result = await _service.UpdateAsync(GetUserId(), id, dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex) when (ex.Message == "Fixed expense not found")
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                await _service.DeleteAsync(GetUserId(), id);
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex) when (ex.Message == "Fixed expense not found")
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/months/{year}/{month}")]
        public async Task<ActionResult> UpdateMonthAmount(
            Guid id,
            int year,
            int month,
            UpdateFixedExpenseMonthAmountDto dto)
        {
            try
            {
                await _service.UpdateMonthAmountAsync(GetUserId(), id, year, month, dto);
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex) when (ex.Message is "Fixed expense not found" or "Month record not found")
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
