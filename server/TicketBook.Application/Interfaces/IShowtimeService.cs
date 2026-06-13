using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Showtimes;

namespace TicketBook.Application.Interfaces;

/// <summary>
/// Coordinates showtime scheduling use cases for every Item type.
/// </summary>
public interface IShowtimeService
{
    /// <summary>
    /// Returns showtimes with optional filters. Venue filtering is resolved through Hall to avoid duplicating VenueId on Showtime.
    /// </summary>
    Task<PagedResult<ShowtimeDto>> GetPagedAsync(
        Guid? itemTypeId,
        Guid? itemId,
        Guid? venueId,
        Guid? hallId,
        DateOnly? date,
        int page,
        int pageSize,
        CancellationToken cancellationToken);

    /// <summary>
    /// Returns a single showtime including its venue, hall, status, and seat availability.
    /// </summary>
    Task<ShowtimeDto> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    /// <summary>
    /// Creates a showtime after the Item and Hall already exist.
    /// </summary>
    Task<ShowtimeDto> CreateAsync(CreateShowtimeRequest request, CancellationToken cancellationToken);

    /// <summary>
    /// Updates a showtime only when doing so does not violate booking and hall-overlap business rules.
    /// </summary>
    Task<ShowtimeDto> UpdateAsync(Guid id, UpdateShowtimeRequest request, CancellationToken cancellationToken);

    /// <summary>
    /// Deletes a showtime only when no booking depends on it.
    /// </summary>
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
