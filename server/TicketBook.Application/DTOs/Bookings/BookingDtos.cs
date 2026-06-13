using TicketBook.Domain.Enums;

namespace TicketBook.Application.DTOs.Bookings;

public sealed record CreateBookingRequest(Guid ShowtimeId, IReadOnlyList<Guid> SeatIds);

public sealed record TicketDto(Guid Id, Guid SeatId, string SeatLabel, string SeatType, decimal Price);

public sealed record BookingDto(
    Guid Id,
    Guid UserId,
    Guid ShowtimeId,
    string ItemTitle,
    string VenueName,
    DateTimeOffset StartTime,
    decimal TotalPrice,
    BookingStatus Status,
    DateTimeOffset CreatedAt,
    IReadOnlyList<TicketDto> Tickets);
