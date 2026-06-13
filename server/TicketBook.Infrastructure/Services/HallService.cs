using Microsoft.EntityFrameworkCore;
using TicketBook.Application.DTOs.Halls;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class HallService : IHallService
{
    private readonly ApplicationDbContext _dbContext;

    public HallService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<HallDto>> GetAllAsync(Guid? venueId, Guid? itemTypeId, CancellationToken cancellationToken)
    {
        var query = _dbContext.Halls
            .AsNoTracking()
            .Include(hall => hall.Venue)
            .Include(hall => hall.HallType)
            .Include(hall => hall.ItemType)
            .AsQueryable();

        if (venueId.HasValue)
        {
            query = query.Where(hall => hall.VenueId == venueId.Value);
        }

        if (itemTypeId.HasValue)
        {
            query = query.Where(hall => hall.ItemTypeId == itemTypeId.Value);
        }

        return await query
            .OrderBy(hall => hall.ItemType.Name)
            .ThenBy(hall => hall.Venue.Name)
            .ThenBy(hall => hall.Name)
            .Select(hall => new HallDto(
                hall.Id,
                hall.VenueId,
                hall.Venue.Name,
                hall.HallTypeId,
                hall.HallType.Name,
                hall.ItemTypeId,
                hall.ItemType.Name,
                hall.ItemType.Slug,
                hall.Name,
                hall.Capacity))
            .ToListAsync(cancellationToken);
    }
}
