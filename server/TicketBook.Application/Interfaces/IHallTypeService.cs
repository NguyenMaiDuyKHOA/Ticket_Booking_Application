using TicketBook.Application.DTOs.HallTypes;

namespace TicketBook.Application.Interfaces;

/// <summary>
/// Provides hall type lookup data for item metadata and scheduling validation.
/// </summary>
public interface IHallTypeService
{
    /// <summary>
    /// Returns all active hall types ordered for admin selection controls.
    /// </summary>
    Task<IReadOnlyList<HallTypeDto>> GetAllAsync(CancellationToken cancellationToken);
}
