using Microsoft.EntityFrameworkCore;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Movies;
using TicketBook.Application.Interfaces;
using TicketBook.Domain.Entities;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class MovieService : IMovieService
{
    private readonly ApplicationDbContext _dbContext;

    public MovieService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<MovieDto>> GetPagedAsync(int page, int pageSize, string? search, CancellationToken cancellationToken)
    {
        (page, pageSize) = NormalizePaging(page, pageSize);

        var query = _dbContext.Movies.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(movie => movie.Title.ToLower().Contains(term) || movie.Genre.ToLower().Contains(term));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var movies = await query
            .OrderByDescending(movie => movie.ReleaseDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        var items = movies.Select(movie => movie.ToDto()).ToList();

        return new PagedResult<MovieDto>(items, page, pageSize, totalCount);
    }

    public async Task<MovieDto> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var movie = await _dbContext.Movies.AsNoTracking().SingleOrDefaultAsync(movie => movie.Id == id, cancellationToken);
        return movie?.ToDto() ?? throw new NotFoundException("Movie was not found.");
    }

    public async Task<MovieDto> CreateAsync(CreateMovieRequest request, CancellationToken cancellationToken)
    {
        ValidateMovie(request.Title, request.Description, request.Duration, request.Genre, request.AgeRating);

        var movie = new Movie
        {
            Type = request.Type,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Duration = request.Duration,
            Genre = request.Genre.Trim(),
            PosterUrl = string.IsNullOrWhiteSpace(request.PosterUrl) ? null : request.PosterUrl.Trim(),
            ReleaseDate = request.ReleaseDate,
            AgeRating = request.AgeRating.Trim()
        };

        _dbContext.Movies.Add(movie);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return movie.ToDto();
    }

    public async Task<MovieDto> UpdateAsync(Guid id, UpdateMovieRequest request, CancellationToken cancellationToken)
    {
        ValidateMovie(request.Title, request.Description, request.Duration, request.Genre, request.AgeRating);

        var movie = await _dbContext.Movies.SingleOrDefaultAsync(movie => movie.Id == id, cancellationToken)
            ?? throw new NotFoundException("Movie was not found.");

        movie.Type = request.Type;
        movie.Title = request.Title.Trim();
        movie.Description = request.Description.Trim();
        movie.Duration = request.Duration;
        movie.Genre = request.Genre.Trim();
        movie.PosterUrl = string.IsNullOrWhiteSpace(request.PosterUrl) ? null : request.PosterUrl.Trim();
        movie.ReleaseDate = request.ReleaseDate;
        movie.AgeRating = request.AgeRating.Trim();

        await _dbContext.SaveChangesAsync(cancellationToken);

        return movie.ToDto();
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var movie = await _dbContext.Movies.SingleOrDefaultAsync(movie => movie.Id == id, cancellationToken)
            ?? throw new NotFoundException("Movie was not found.");

        _dbContext.Movies.Remove(movie);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void ValidateMovie(string title, string description, int duration, string genre, string ageRating)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ValidationException("Movie title is required.");
        }

        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ValidationException("Movie description is required.");
        }

        if (duration <= 0)
        {
            throw new ValidationException("Movie duration must be greater than zero.");
        }

        if (string.IsNullOrWhiteSpace(genre))
        {
            throw new ValidationException("Movie genre is required.");
        }

        if (string.IsNullOrWhiteSpace(ageRating))
        {
            throw new ValidationException("Movie age rating is required.");
        }
    }

    private static (int Page, int PageSize) NormalizePaging(int page, int pageSize)
    {
        return (Math.Max(1, page), Math.Clamp(pageSize, 1, 100));
    }
}
