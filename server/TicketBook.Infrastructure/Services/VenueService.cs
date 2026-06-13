using Microsoft.EntityFrameworkCore;
using TicketBook.Application.DTOs.Venues;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class VenueService : IVenueService
{
    private readonly ApplicationDbContext _dbContext;

    public VenueService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<VenueDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Venues
            .AsNoTracking()
            .Include(venue => venue.City)
            .OrderBy(venue => venue.Name)
            .Select(venue => new VenueDto(
                venue.Id,
                venue.CityId,
                venue.City.Name,
                venue.Name,
                venue.Address))
            .ToListAsync(cancellationToken);
    }
}
