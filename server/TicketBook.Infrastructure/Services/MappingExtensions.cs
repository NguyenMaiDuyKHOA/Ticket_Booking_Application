using TicketBook.Application.DTOs.Bookings;
using TicketBook.Application.DTOs.Cinemas;
using TicketBook.Application.DTOs.Movies;
using TicketBook.Application.DTOs.Showtimes;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Services;

internal static class MappingExtensions
{
    public static MovieDto ToDto(this Movie movie) =>
        new(movie.Id, movie.Type, movie.Title, movie.Description, movie.Duration, movie.Genre, movie.PosterUrl, movie.ReleaseDate, movie.AgeRating);

    public static CinemaDto ToDto(this Cinema cinema) =>
        new(cinema.Id, cinema.Name, cinema.Address, cinema.City);

    public static SeatDto ToDto(this Seat seat) =>
        new(seat.Id, seat.SeatNumber, seat.SeatType, seat.IsBooked);

    public static ShowtimeDto ToDto(this Showtime showtime) =>
        new(
            showtime.Id,
            showtime.MovieId,
            showtime.Movie.Title,
            showtime.CinemaId,
            showtime.Cinema.Name,
            showtime.StartTime,
            showtime.EndTime,
            showtime.RoomNumber,
            showtime.StandardSeatPrice,
            showtime.VipSeatPrice,
            showtime.Seats.Count(seat => !seat.IsBooked),
            showtime.Seats.OrderBy(seat => seat.SeatNumber).Select(seat => seat.ToDto()).ToList());

    public static BookingDto ToDto(this Booking booking) =>
        new(
            booking.Id,
            booking.UserId,
            booking.ShowtimeId,
            booking.Showtime.Movie.Title,
            booking.Showtime.Cinema.Name,
            booking.Showtime.StartTime,
            booking.TotalPrice,
            booking.Status,
            booking.CreatedAt,
            booking.Tickets
                .OrderBy(ticket => ticket.Seat.SeatNumber)
                .Select(ticket => new TicketDto(ticket.Id, ticket.SeatId, ticket.Seat.SeatNumber, ticket.Seat.SeatType, ticket.Price))
                .ToList());
}
