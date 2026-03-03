using FinanceApp.Api.Models;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Services.Intefaces;
using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Exceptions;

namespace FinanceApp.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IExpenseRepository _expenseRepository;
    private readonly ICategoryShareRepository _shareRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICategoryMonthConfigRepository _monthConfigRepository;

    public CategoryService(
        ICategoryRepository categoryRepository,
        IExpenseRepository expenseRepository,
        ICategoryShareRepository shareRepository,
        IUserRepository userRepository,
        ICategoryMonthConfigRepository monthConfigRepository)
    {
        _categoryRepository = categoryRepository;
        _expenseRepository = expenseRepository;
        _shareRepository = shareRepository;
        _userRepository = userRepository;
        _monthConfigRepository = monthConfigRepository;
    }

    public async Task<List<CategoryResponseDto>> GetUserCategoriesAsync(Guid userId, int year, int month)
    {
        var ownedCategories = await _categoryRepository.GetUserCategoriesAsync(userId, year, month);
        var sharedCategories = await _categoryRepository.GetSharedCategoriesAsync(userId, year, month);

        var allCategories = ownedCategories.Concat(sharedCategories);

        return allCategories.Select(c =>
        {
            var config = c.MonthConfigs.FirstOrDefault();
            var currentValue = c.Expenses.Sum(e => e.Amount);
            var maxValue = config?.MaxValue ?? 0;
            return new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                Color = c.Color,
                MaxValue = maxValue,
                HasMonthConfig = config != null,
                CurrentValue = currentValue,
                IsOverLimit = config != null && currentValue > maxValue,
                IsOwner = c.OwnerId == userId
            };
        }).ToList();
    }

    public async Task<CategoryResponseDto> CreateCategoryAsync(Guid userId, CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Icon = dto.Icon,
            Color = dto.Color,
            OwnerId = userId
        };

        await _categoryRepository.AddAsync(category);
        await _categoryRepository.SaveChangesAsync();

        var year = dto.Year ?? DateTime.UtcNow.Year;
        var month = dto.Month ?? DateTime.UtcNow.Month;

        var config = new CategoryMonthConfig
        {
            CategoryId = category.Id,
            Year = year,
            Month = month,
            MaxValue = dto.MaxValue
        };
        await _monthConfigRepository.AddAsync(config);
        await _monthConfigRepository.SaveChangesAsync();

        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Icon = category.Icon,
            Color = category.Color,
            MaxValue = config.MaxValue,
            HasMonthConfig = true,
            CurrentValue = 0,
            IsOverLimit = false,
            IsOwner = true
        };
    }

    public async Task<ExpenseResponseDto> AddExpenseAsync(Guid userId, Guid categoryId, CreateExpenseDto dto)
    {
        // Fetch the category first — if it doesn't exist there's no point checking access
        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category == null)
            throw new NotFoundException("Category not found");

        var hasAccess = await _categoryRepository.UserHasAccessAsync(userId, categoryId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this category");

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
            throw new NotFoundException("Category not found");

        if (category.OwnerId != userId)
            throw new UnauthorizedAccessException("Only the owner can share this category");

        var sharedWithUser = await _userRepository.GetByEmailAsync(dto.UserEmail);
        if (sharedWithUser == null)
            throw new NotFoundException("User not found");

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

    public async Task<CategoryStatusDto> GetCategoryStatusAsync(Guid userId, Guid categoryId, int year, int month)
    {
        var hasAccess = await _categoryRepository.UserHasAccessAsync(userId, categoryId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this category");

        var category = await _categoryRepository.GetCategoryWithExpensesAsync(categoryId);
        if (category == null)
            throw new NotFoundException("Category not found");

        var config = await _monthConfigRepository.GetAsync(categoryId, year, month);
        var currentValue = category.Expenses
            .Where(e => e.CreatedAt.Year == year && e.CreatedAt.Month == month)
            .Sum(e => e.Amount);
        var maxValue = config?.MaxValue ?? 0;

        return new CategoryStatusDto
        {
            CategoryId = category.Id,
            CategoryName = category.Name,
            MaxValue = maxValue,
            CurrentValue = currentValue,
            IsOverLimit = config != null && currentValue > maxValue,
            Percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0
        };
    }

    public async Task<MonthConfigResponseDto> UpsertMonthConfigAsync(Guid userId, Guid categoryId, UpsertMonthConfigDto dto)
    {
        var hasAccess = await _categoryRepository.UserHasAccessAsync(userId, categoryId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this category");

        var existing = await _monthConfigRepository.GetAsync(categoryId, dto.Year, dto.Month);
        if (existing != null)
        {
            existing.MaxValue = dto.MaxValue;
            existing.UpdatedAt = DateTime.UtcNow;
            _monthConfigRepository.Update(existing);
        }
        else
        {
            existing = new CategoryMonthConfig
            {
                CategoryId = categoryId,
                Year = dto.Year,
                Month = dto.Month,
                MaxValue = dto.MaxValue
            };
            await _monthConfigRepository.AddAsync(existing);
        }
        await _monthConfigRepository.SaveChangesAsync();

        return new MonthConfigResponseDto
        {
            Id = existing.Id,
            CategoryId = existing.CategoryId,
            Year = existing.Year,
            Month = existing.Month,
            MaxValue = existing.MaxValue,
            IsConfigured = true
        };
    }

    public async Task<MonthConfigResponseDto> GetMonthConfigAsync(Guid userId, Guid categoryId, int year, int month)
    {
        var hasAccess = await _categoryRepository.UserHasAccessAsync(userId, categoryId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this category");

        var config = await _monthConfigRepository.GetAsync(categoryId, year, month);
        return new MonthConfigResponseDto
        {
            Id = config?.Id ?? Guid.Empty,
            CategoryId = categoryId,
            Year = year,
            Month = month,
            MaxValue = config?.MaxValue ?? 0,
            IsConfigured = config != null
        };
    }

    public async Task<List<ExpenseResponseDto>> GetCategoryExpensesAsync(Guid userId, Guid categoryId, int year, int month)
    {
        var hasAccess = await _categoryRepository.UserHasAccessAsync(userId, categoryId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this category");

        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category == null)
            throw new NotFoundException("Category not found");

        var startDate = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endDate = startDate.AddMonths(1).AddTicks(-1);

        var expenses = await _expenseRepository.GetByDateRangeAsync(categoryId, startDate, endDate);

        return expenses.Select(e => new ExpenseResponseDto
        {
            Id = e.Id,
            Amount = e.Amount,
            Description = e.Description,
            CreatedAt = e.CreatedAt,
            CategoryName = category.Name
        }).ToList();
    }

    public async Task<ExpenseResponseDto> UpdateExpenseAsync(Guid userId, Guid categoryId, Guid expenseId, UpdateExpenseDto dto)
    {
        var hasAccess = await _categoryRepository.UserHasAccessAsync(userId, categoryId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this category");

        var expense = await _expenseRepository.GetExpenseWithDetailsAsync(expenseId);
        if (expense == null)
            throw new NotFoundException("Expense not found");

        if (expense.CategoryId != categoryId)
            throw new UnauthorizedAccessException("Expense does not belong to this category");

        expense.Amount = dto.Amount;
        expense.Description = dto.Description;

        _expenseRepository.Update(expense);
        await _expenseRepository.SaveChangesAsync();

        return new ExpenseResponseDto
        {
            Id = expense.Id,
            Amount = expense.Amount,
            Description = expense.Description,
            CreatedAt = expense.CreatedAt,
            CategoryName = expense.Category.Name
        };
    }

    public async Task DeleteExpenseAsync(Guid userId, Guid categoryId, Guid expenseId)
    {
        var hasAccess = await _categoryRepository.UserHasAccessAsync(userId, categoryId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this category");

        var expense = await _expenseRepository.GetExpenseWithDetailsAsync(expenseId);
        if (expense == null)
            throw new NotFoundException("Expense not found");

        if (expense.CategoryId != categoryId)
            throw new UnauthorizedAccessException("Expense does not belong to this category");

        _expenseRepository.Delete(expense);
        await _expenseRepository.SaveChangesAsync();
    }

    public async Task<CategoryResponseDto> UpdateCategoryAsync(Guid userId, Guid categoryId, UpdateCategoryDto dto, int year, int month)
    {
        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category == null)
            throw new NotFoundException("Category not found");

        if (category.OwnerId != userId)
            throw new UnauthorizedAccessException("Only the owner can edit this category");

        category.Name = dto.Name;
        category.Icon = dto.Icon;
        category.Color = dto.Color;

        _categoryRepository.Update(category);
        await _categoryRepository.SaveChangesAsync();

        var config = await _monthConfigRepository.GetAsync(categoryId, year, month);
        var startDate = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endDate = startDate.AddMonths(1).AddTicks(-1);
        var expenses = await _expenseRepository.GetByDateRangeAsync(categoryId, startDate, endDate);
        var currentValue = expenses.Sum(e => e.Amount);
        var maxValue = config?.MaxValue ?? 0;

        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Icon = category.Icon,
            Color = category.Color,
            MaxValue = maxValue,
            HasMonthConfig = config != null,
            CurrentValue = currentValue,
            IsOverLimit = config != null && currentValue > maxValue,
            IsOwner = true
        };
    }
}
