using TicketBook.Application.DTOs.Venues;

namespace TicketBook.Application.Interfaces;

/// <summary>
/// Provides venue lookup data used to filter halls while scheduling showtimes.
/// </summary>
public interface IVenueService
{
    /// <summary>
    /// Returns venues with their city labels for admin scheduling screens.
    /// </summary>
    Task<IReadOnlyList<VenueDto>> GetAllAsync(CancellationToken cancellationToken);
}
