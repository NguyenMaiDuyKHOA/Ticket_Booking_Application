using Microsoft.EntityFrameworkCore;
using TicketBook.Application.DTOs.ShowtimeStatuses;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class ShowtimeStatusService : IShowtimeStatusService
{
    private readonly ApplicationDbContext _dbContext;

    public ShowtimeStatusService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ShowtimeStatusDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.ShowtimeStatuses
            .AsNoTracking()
            .OrderBy(showtimeStatus => showtimeStatus.Name)
            .Select(showtimeStatus => new ShowtimeStatusDto(
                showtimeStatus.Id,
                showtimeStatus.Name,
                showtimeStatus.Slug,
                showtimeStatus.Description))
            .ToListAsync(cancellationToken);
    }
}
