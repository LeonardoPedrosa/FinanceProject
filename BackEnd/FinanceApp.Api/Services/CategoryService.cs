using FinanceApp.Api.Models;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Services.Intefaces;
using FinanceApp.Api.Data.Interfaces;

namespace FinanceApp.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IExpenseRepository _expenseRepository;
    private readonly ICategoryShareRepository _shareRepository;
    private readonly IUserRepository _userRepository;

    public CategoryService(
        ICategoryRepository categoryRepository,
        IExpenseRepository expenseRepository,
        ICategoryShareRepository shareRepository,
        IUserRepository userRepository)
    {
        _categoryRepository = categoryRepository;
        _expenseRepository = expenseRepository;
        _shareRepository = shareRepository;
        _userRepository = userRepository;
    }

    public async Task<List<CategoryResponseDto>> GetUserCategoriesAsync(Guid userId)
    {
        var ownedCategories = await _categoryRepository.GetUserCategoriesAsync(userId);
        var sharedCategories = await _categoryRepository.GetSharedCategoriesAsync(userId);

        var allCategories = ownedCategories.Concat(sharedCategories);

        return allCategories.Select(c => new CategoryResponseDto
        {
            Id = c.Id,
            Name = c.Name,
            Icon = c.Icon,
            Color = c.Color,
            MaxValue = c.MaxValue,
            CurrentValue = c.Expenses.Sum(e => e.Amount),
            IsOverLimit = c.Expenses.Sum(e => e.Amount) > c.MaxValue,
            IsOwner = c.OwnerId == userId
        }).ToList();
    }

    public async Task<CategoryResponseDto> CreateCategoryAsync(Guid userId, CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Icon = dto.Icon,
            Color = dto.Color,
            MaxValue = dto.MaxValue,
            OwnerId = userId
        };

        await _categoryRepository.AddAsync(category);
        await _categoryRepository.SaveChangesAsync();

        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Icon = category.Icon,
            Color = category.Color,
            MaxValue = category.MaxValue,
            CurrentValue = 0,
            IsOverLimit = false,
            IsOwner = true
        };
    }

    public async Task<ExpenseResponseDto> AddExpenseAsync(Guid userId, Guid categoryId, CreateExpenseDto dto)
    {
        var hasAccess = await _categoryRepository.UserHasAccessAsync(userId, categoryId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this category");

        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category == null)
            throw new Exception("Category not found");

        var expense = new Expense
        {
            CategoryId = categoryId,
            Amount = dto.Amount,
            Description = dto.Description,
            UserId = userId
        };

        await _expenseRepository.AddAsync(expense);
        await _expenseRepository.SaveChangesAsync();

        return new ExpenseResponseDto
        {
            Id = expense.Id,
            Amount = expense.Amount,
            Description = expense.Description,
            CreatedAt = expense.CreatedAt,
            CategoryName = category.Name
        };
    }

    public async Task ShareCategoryAsync(Guid userId, Guid categoryId, ShareCategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(categoryId);

        if (category == null)
            throw new Exception("Category not found");

        if (category.OwnerId != userId)
            throw new UnauthorizedAccessException("Only the owner can share this category");

        var sharedWithUser = await _userRepository.GetByEmailAsync(dto.UserEmail);
        if (sharedWithUser == null)
            throw new Exception("User not found");

        var existingShare = await _shareRepository.GetShareAsync(categoryId, sharedWithUser.Id);
        if (existingShare != null)
            throw new Exception("Category already shared with this user");

        var share = new CategoryShare
        {
            CategoryId = categoryId,
            SharedWithUserId = sharedWithUser.Id,
            CanEdit = dto.CanEdit
        };

        await _shareRepository.AddAsync(share);
        await _shareRepository.SaveChangesAsync();
    }

    public async Task<CategoryStatusDto> GetCategoryStatusAsync(Guid categoryId)
    {
        var category = await _categoryRepository.GetCategoryWithExpensesAsync(categoryId);

        if (category == null)
            throw new Exception("Category not found");

        var currentValue = category.Expenses.Sum(e => e.Amount);

        return new CategoryStatusDto
        {
            CategoryId = category.Id,
            CategoryName = category.Name,
            MaxValue = category.MaxValue,
            CurrentValue = currentValue,
            IsOverLimit = currentValue > category.MaxValue,
            Percentage = (currentValue / category.MaxValue) * 100
        };
    }
}
