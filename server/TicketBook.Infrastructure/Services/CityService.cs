using Microsoft.EntityFrameworkCore;
using TicketBook.Application.DTOs.Cities;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class CityService : ICityService
{
    private readonly ApplicationDbContext _dbContext;

    public CityService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<CityDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Cities
            .AsNoTracking()
            .OrderBy(city => city.Name)
            .Select(city => new CityDto(city.Id, city.Name, city.Slug))
            .ToListAsync(cancellationToken);
    }
}
