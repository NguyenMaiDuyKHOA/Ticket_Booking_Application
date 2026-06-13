namespace TicketBook.Application.DTOs.Showtimes;

/// <summary>
/// Seat projection for a specific showtime. Booking availability is calculated from BookedSeat, not stored on Seat.
/// </summary>
public sealed record SeatDto(Guid Id, string Row, int Number, string SeatLabel, string SeatType, bool IsBooked);

/// <summary>
/// Showtime read model. Venue fields are derived through Hall for display and filtering; Showtime itself stores HallId only.
/// </summary>
public sealed record ShowtimeDto(
    Guid Id,
    Guid ItemId,
    string ItemTitle,
    Guid ItemTypeId,
    string ItemTypeName,
    string ItemTypeSlug,
    Guid VenueId,
    string VenueName,
    Guid HallId,
    string HallName,
    Guid ShowtimeStatusId,
    string ShowtimeStatusName,
    string ShowtimeStatusSlug,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    decimal Price,
    int AvailableSeats,
    IReadOnlyList<SeatDto> Seats);

/// <summary>
/// Request used after an Item has been created. Venue is intentionally omitted because Hall already belongs to a Venue.
/// </summary>
public sealed record CreateShowtimeRequest(
    Guid ItemId,
    Guid HallId,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    decimal Price,
    Guid? ShowtimeStatusId = null);

/// <summary>
/// Request for rescheduling a showtime before bookings exist.
/// </summary>
public sealed record UpdateShowtimeRequest(
    Guid ItemId,
    Guid HallId,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    decimal Price,
    Guid? ShowtimeStatusId = null);
