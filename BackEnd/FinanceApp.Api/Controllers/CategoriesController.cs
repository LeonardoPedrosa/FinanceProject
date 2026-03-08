using System.Security.Claims;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Exceptions;
using FinanceApp.Api.Services.Intefaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<List<CategoryResponseDto>>> GetCategories([FromQuery] int? year, [FromQuery] int? month)
        {
            var now = DateTime.UtcNow;
            var y = year ?? now.Year;
            var m = month ?? now.Month;
            var categories = await _categoryService.GetUserCategoriesAsync(GetUserId(), y, m);
            return Ok(categories);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryResponseDto>> CreateCategory(CreateCategoryDto dto)
        {
            var category = await _categoryService.CreateCategoryAsync(GetUserId(), dto);
            return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
        }

        [HttpPost("{categoryId}/expenses")]
        public async Task<ActionResult<ExpenseResponseDto>> AddExpense(Guid categoryId, CreateExpenseDto dto)
        {
            try
            {
                var expense = await _categoryService.AddExpenseAsync(GetUserId(), categoryId, dto);
                return Ok(expense);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("{categoryId}/share")]
        public async Task<ActionResult> ShareCategory(Guid categoryId, ShareCategoryDto dto)
        {
            try
            {
                await _categoryService.ShareCategoryAsync(GetUserId(), categoryId, dto);
                return Ok(new { message = "Category shared successfully" });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("{categoryId}/month-config")]
        public async Task<ActionResult<MonthConfigResponseDto>> UpsertMonthConfig(Guid categoryId, UpsertMonthConfigDto dto)
        {
            var config = await _categoryService.UpsertMonthConfigAsync(GetUserId(), categoryId, dto);
            return Ok(config);
        }

        [HttpGet("{categoryId}/month-config/{year}/{month}")]
        public async Task<ActionResult<MonthConfigResponseDto>> GetMonthConfig(Guid categoryId, int year, int month)
        {
            var config = await _categoryService.GetMonthConfigAsync(GetUserId(), categoryId, year, month);
            return Ok(config);
        }

        [HttpGet("{categoryId}/expenses")]
        public async Task<ActionResult<List<ExpenseResponseDto>>> GetExpenses(Guid categoryId, [FromQuery] int? year, [FromQuery] int? month)
        {
            var now = DateTime.UtcNow;
            try
            {
                var expenses = await _categoryService.GetCategoryExpensesAsync(GetUserId(), categoryId, year ?? now.Year, month ?? now.Month);
                return Ok(expenses);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPut("{categoryId}/expenses/{expenseId}")]
        public async Task<ActionResult<ExpenseResponseDto>> UpdateExpense(Guid categoryId, Guid expenseId, UpdateExpenseDto dto)
        {
            try
            {
                var expense = await _categoryService.UpdateExpenseAsync(GetUserId(), categoryId, expenseId, dto);
                return Ok(expense);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{categoryId}/expenses/{expenseId}")]
        public async Task<ActionResult> DeleteExpense(Guid categoryId, Guid expenseId)
        {
            try
            {
                await _categoryService.DeleteExpenseAsync(GetUserId(), categoryId, expenseId);
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("{categoryId}")]
        public async Task<ActionResult<CategoryResponseDto>> UpdateCategory(
            Guid categoryId,
            [FromBody] UpdateCategoryDto dto,
            [FromQuery] int? year,
            [FromQuery] int? month)
        {
            var now = DateTime.UtcNow;
            try
            {
                var category = await _categoryService.UpdateCategoryAsync(
                    GetUserId(), categoryId, dto, year ?? now.Year, month ?? now.Month);
                return Ok(category);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
