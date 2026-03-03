using FinanceApp.Api.DTOs;
using FinanceApp.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/savings-goals")]
    public class SavingsGoalsController : ControllerBase
    {
        private readonly ISavingsGoalService _service;

        public SavingsGoalsController(ISavingsGoalService service)
        {
            _service = service;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<List<SavingsGoalResponseDto>>> GetAll()
        {
            var goals = await _service.GetAllAsync(GetUserId());
            return Ok(goals);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SavingsGoalResponseDto>> GetById(Guid id)
        {
            try
            {
                var goal = await _service.GetByIdAsync(GetUserId(), id);
                return Ok(goal);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex) when (ex.Message == "Goal not found")
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<SavingsGoalResponseDto>> Create(CreateSavingsGoalDto dto)
        {
            var goal = await _service.CreateAsync(GetUserId(), dto);
            return CreatedAtAction(nameof(GetById), new { id = goal.Id }, goal);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SavingsGoalResponseDto>> Update(Guid id, UpdateSavingsGoalDto dto)
        {
            try
            {
                var goal = await _service.UpdateAsync(GetUserId(), id, dto);
                return Ok(goal);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex) when (ex.Message == "Goal not found")
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
            catch (Exception ex) when (ex.Message == "Goal not found")
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
