using TicketBook.Domain.Enums;

namespace TicketBook.Application.DTOs.Showtimes;

public sealed record SeatDto(Guid Id, string SeatNumber, SeatType SeatType, bool IsBooked);

public sealed record ShowtimeDto(
    Guid Id,
    Guid MovieId,
    string MovieTitle,
    Guid CinemaId,
    string CinemaName,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    string RoomNumber,
    decimal StandardSeatPrice,
    decimal VipSeatPrice,
    int AvailableSeats,
    IReadOnlyList<SeatDto> Seats);

public sealed record CreateShowtimeRequest(
    Guid MovieId,
    Guid CinemaId,
    DateTimeOffset StartTime,
    string RoomNumber,
    decimal StandardSeatPrice,
    decimal VipSeatPrice,
    int SeatCount,
    int VipSeatCount);

public sealed record UpdateShowtimeRequest(
    DateTimeOffset StartTime,
    string RoomNumber,
    decimal StandardSeatPrice,
    decimal VipSeatPrice);
