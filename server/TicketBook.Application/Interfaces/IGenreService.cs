using TicketBook.Application.DTOs.Genres;

namespace TicketBook.Application.Interfaces;

/// <summary>
/// Provides read access to reusable catalog genres.
/// </summary>
public interface IGenreService
{
    /// <summary>
    /// Returns all active genres ordered for management UI selection.
    /// </summary>
    Task<IReadOnlyList<GenreDto>> GetAllAsync(CancellationToken cancellationToken);
}
