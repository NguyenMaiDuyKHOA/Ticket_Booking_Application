using Microsoft.EntityFrameworkCore;
using TicketBook.Application.DTOs.Genres;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class GenreService : IGenreService
{
    private readonly ApplicationDbContext _dbContext;

    public GenreService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<GenreDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Genres
            .AsNoTracking()
            .OrderBy(genre => genre.ItemType.Name)
            .ThenBy(genre => genre.Name)
            .Select(genre => new GenreDto(
                genre.Id,
                genre.ItemTypeId,
                genre.ItemType.Slug,
                genre.Name,
                genre.Slug,
                genre.Description))
            .ToListAsync(cancellationToken);
    }
}
