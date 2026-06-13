namespace TicketBook.Application.DTOs.Halls;

/// <summary>
/// Read model used by scheduling screens. Venue and item type are included for filtering; Showtime stores HallId only.
/// </summary>
public sealed record HallDto(
    Guid Id,
    Guid VenueId,
    string VenueName,
    Guid HallTypeId,
    string HallTypeName,
    Guid ItemTypeId,
    string ItemTypeName,
    string ItemTypeSlug,
    string Name,
    int Capacity);
