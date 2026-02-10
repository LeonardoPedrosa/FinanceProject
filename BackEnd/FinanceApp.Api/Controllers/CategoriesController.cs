using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Services.Intefaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace FinanceApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : Controller
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<List<CategoryResponseDto>>> GetCategories()
        {
            var categories = await _categoryService.GetUserCategoriesAsync(GetUserId());
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
            var expense = await _categoryService.AddExpenseAsync(GetUserId(), categoryId, dto);
            return Ok(expense);
        }

        [HttpPost("{categoryId}/share")]
        public async Task<ActionResult> ShareCategory(Guid categoryId, ShareCategoryDto dto)
        {
            await _categoryService.ShareCategoryAsync(GetUserId(), categoryId, dto);
            return Ok(new { message = "Category shared successfully" });
        }

        [HttpGet("{categoryId}/status")]
        public async Task<ActionResult<CategoryStatusDto>> GetCategoryStatus(Guid categoryId)
        {
            var status = await _categoryService.GetCategoryStatusAsync(categoryId);
            return Ok(status);
        }
    }
}