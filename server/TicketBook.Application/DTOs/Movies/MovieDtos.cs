using TicketBook.Domain.Enums;

namespace TicketBook.Application.DTOs.Movies;

public sealed record MovieDto(
    Guid Id,
    MovieType Type,
    string Title,
    string Description,
    int Duration,
    string Genre,
    string? PosterUrl,
    DateOnly ReleaseDate,
    string AgeRating);

public sealed record CreateMovieRequest(
    MovieType Type,
    string Title,
    string Description,
    int Duration,
    string Genre,
    string? PosterUrl,
    DateOnly ReleaseDate,
    string AgeRating);

public sealed record UpdateMovieRequest(
    MovieType Type,
    string Title,
    string Description,
    int Duration,
    string Genre,
    string? PosterUrl,
    DateOnly ReleaseDate,
    string AgeRating);
