using TicketBook.Application.DTOs.Cities;

namespace TicketBook.Application.Interfaces;

/// <summary>
/// Provides normalized city options for catalog and venue workflows.
/// </summary>
public interface ICityService
{
    /// <summary>
    /// Returns active cities ordered for dropdown display.
    /// </summary>
    Task<IReadOnlyList<CityDto>> GetAllAsync(CancellationToken cancellationToken);
}
