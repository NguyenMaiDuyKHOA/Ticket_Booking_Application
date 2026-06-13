using Microsoft.EntityFrameworkCore;
using TicketBook.Application.DTOs.ItemTypes;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class ItemTypeService : IItemTypeService
{
    private readonly ApplicationDbContext _dbContext;

    public ItemTypeService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ItemTypeDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.ItemTypes
            .AsNoTracking()
            .Where(itemType => itemType.Slug != "movie")
            .OrderBy(itemType => itemType.Name)
            .Select(itemType => new ItemTypeDto(
                itemType.Id,
                itemType.Name,
                itemType.Slug,
                itemType.Description))
            .ToListAsync(cancellationToken);
    }
}
