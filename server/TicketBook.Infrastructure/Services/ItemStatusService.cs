using Microsoft.EntityFrameworkCore;
using TicketBook.Application.DTOs.ItemStatuses;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class ItemStatusService : IItemStatusService
{
    private readonly ApplicationDbContext _dbContext;

    public ItemStatusService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ItemStatusDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.ItemStatuses
            .AsNoTracking()
            .OrderBy(itemStatus => itemStatus.Slug == "draft"
                ? 0
                : itemStatus.Slug == "published"
                    ? 1
                    : itemStatus.Slug == "unpublished"
                        ? 2
                        : itemStatus.Slug == "archived"
                            ? 3
                            : 99)
            .ThenBy(itemStatus => itemStatus.Name)
            .Select(itemStatus => new ItemStatusDto(
                itemStatus.Id,
                itemStatus.Name,
                itemStatus.Slug,
                itemStatus.Description))
            .ToListAsync(cancellationToken);
    }
}
