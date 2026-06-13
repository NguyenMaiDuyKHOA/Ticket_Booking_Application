namespace TicketBook.Application.DTOs.Venues;

/// <summary>
/// Read model used by scheduling screens to group halls by hosting venue.
/// </summary>
public sealed record VenueDto(Guid Id, Guid CityId, string CityName, string Name, string Address);
