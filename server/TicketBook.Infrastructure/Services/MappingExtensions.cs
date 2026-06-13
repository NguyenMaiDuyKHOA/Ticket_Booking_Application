using TicketBook.Application.DTOs.Bookings;
using TicketBook.Application.DTOs.Showtimes;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Services;

internal static class MappingExtensions
{
    public static SeatDto ToDto(this Seat seat, bool isBooked = false) =>
        new(seat.Id, seat.Row, seat.Number, GetSeatLabel(seat), seat.SeatType.Name, isBooked);

    public static ShowtimeDto ToDto(this Showtime showtime) =>
        new(
            showtime.Id,
            showtime.ItemId,
            showtime.Item.Title,
            showtime.Item.ItemTypeId,
            showtime.Item.ItemType.Name,
            showtime.Item.ItemType.Slug,
            showtime.Hall.VenueId,
            showtime.Hall.Venue.Name,
            showtime.HallId,
            showtime.Hall.Name,
            showtime.ShowtimeStatusId,
            showtime.ShowtimeStatus.Name,
            showtime.ShowtimeStatus.Slug,
            showtime.StartTime,
            showtime.EndTime,
            showtime.Price,
            GetAvailableSeats(showtime),
            GetShowtimeSeats(showtime));

    public static BookingDto ToDto(this Booking booking) =>
        new(
            booking.Id,
            booking.UserId,
            booking.ShowtimeId,
            booking.Showtime.Item.Title,
            booking.Showtime.Hall.Venue.Name,
            booking.Showtime.StartTime,
            booking.TotalPrice,
            booking.Status,
            booking.CreatedAt,
            booking.Tickets
                .OrderBy(ticket => ticket.Seat.Row)
                .ThenBy(ticket => ticket.Seat.Number)
                .Select(ticket => new TicketDto(ticket.Id, ticket.SeatId, GetSeatLabel(ticket.Seat), ticket.Seat.SeatType.Name, ticket.Price))
                .ToList());

    private static string GetSeatLabel(Seat seat) => $"{seat.Row}{seat.Number}";

    private static List<SeatDto> GetShowtimeSeats(Showtime showtime)
    {
        var bookedSeatIds = showtime.BookedSeats
            .Where(bookedSeat => bookedSeat.Booking.Status != TicketBook.Domain.Enums.BookingStatus.Cancelled)
            .Select(bookedSeat => bookedSeat.SeatId)
            .ToHashSet();

        return showtime.Hall?.Seats
            .OrderBy(seat => seat.Row)
            .ThenBy(seat => seat.Number)
            .Select(seat => seat.ToDto(bookedSeatIds.Contains(seat.Id)))
            .ToList() ?? new List<SeatDto>();
    }

    private static int GetAvailableSeats(Showtime showtime)
    {
        var seats = GetShowtimeSeats(showtime);
        return seats.Count(seat => !seat.IsBooked);
    }
}
