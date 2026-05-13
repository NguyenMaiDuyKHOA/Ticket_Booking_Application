using Microsoft.EntityFrameworkCore;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Cinemas;
using TicketBook.Application.Interfaces;
using TicketBook.Domain.Entities;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class CinemaService : ICinemaService
{
    private readonly ApplicationDbContext _dbContext;

    public CinemaService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<CinemaDto>> GetPagedAsync(int page, int pageSize, string? city, CancellationToken cancellationToken)
    {
        (page, pageSize) = NormalizePaging(page, pageSize);

        var query = _dbContext.Cinemas.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(city))
        {
            var term = city.Trim().ToLower();
            query = query.Where(cinema => cinema.City.ToLower().Contains(term));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var cinemas = await query
            .OrderBy(cinema => cinema.City)
            .ThenBy(cinema => cinema.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        var items = cinemas.Select(cinema => cinema.ToDto()).ToList();

        return new PagedResult<CinemaDto>(items, page, pageSize, totalCount);
    }

    public async Task<CinemaDto> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var cinema = await _dbContext.Cinemas.AsNoTracking().SingleOrDefaultAsync(cinema => cinema.Id == id, cancellationToken);
        return cinema?.ToDto() ?? throw new NotFoundException("Cinema was not found.");
    }

    public async Task<CinemaDto> CreateAsync(CreateCinemaRequest request, CancellationToken cancellationToken)
    {
        ValidateCinema(request.Name, request.Address, request.City);

        var cinema = new Cinema
        {
            Name = request.Name.Trim(),
            Address = request.Address.Trim(),
            City = request.City.Trim()
        };

        _dbContext.Cinemas.Add(cinema);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return cinema.ToDto();
    }

    public async Task<CinemaDto> UpdateAsync(Guid id, UpdateCinemaRequest request, CancellationToken cancellationToken)
    {
        ValidateCinema(request.Name, request.Address, request.City);

        var cinema = await _dbContext.Cinemas.SingleOrDefaultAsync(cinema => cinema.Id == id, cancellationToken)
            ?? throw new NotFoundException("Cinema was not found.");

        cinema.Name = request.Name.Trim();
        cinema.Address = request.Address.Trim();
        cinema.City = request.City.Trim();

        await _dbContext.SaveChangesAsync(cancellationToken);

        return cinema.ToDto();
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var cinema = await _dbContext.Cinemas.SingleOrDefaultAsync(cinema => cinema.Id == id, cancellationToken)
            ?? throw new NotFoundException("Cinema was not found.");

        _dbContext.Cinemas.Remove(cinema);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void ValidateCinema(string name, string address, string city)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ValidationException("Cinema name is required.");
        }

        if (string.IsNullOrWhiteSpace(address))
        {
            throw new ValidationException("Cinema address is required.");
        }

        if (string.IsNullOrWhiteSpace(city))
        {
            throw new ValidationException("Cinema city is required.");
        }
    }

    private static (int Page, int PageSize) NormalizePaging(int page, int pageSize)
    {
        return (Math.Max(1, page), Math.Clamp(pageSize, 1, 100));
    }
}
