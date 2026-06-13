using TicketBook.Application.DTOs.Halls;

namespace TicketBook.Application.Interfaces;

/// <summary>
/// Provides hall lookup data for scheduling workflows.
/// </summary>
public interface IHallService
{
    /// <summary>
    /// Returns halls, optionally filtered by venue and item type for dependent selects in the admin UI.
    /// </summary>
    Task<IReadOnlyList<HallDto>> GetAllAsync(Guid? venueId, Guid? itemTypeId, CancellationToken cancellationToken);
}
