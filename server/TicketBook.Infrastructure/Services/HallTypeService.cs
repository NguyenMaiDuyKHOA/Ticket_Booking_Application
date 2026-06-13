using Microsoft.EntityFrameworkCore;
using TicketBook.Application.DTOs.HallTypes;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class HallTypeService : IHallTypeService
{
    private readonly ApplicationDbContext _dbContext;

    public HallTypeService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<HallTypeDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.HallTypes
            .AsNoTracking()
            .OrderBy(hallType => hallType.Name)
            .Select(hallType => new HallTypeDto(
                hallType.Id,
                hallType.Name,
                hallType.Slug))
            .ToListAsync(cancellationToken);
    }
}
