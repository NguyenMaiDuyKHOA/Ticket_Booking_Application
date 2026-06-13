using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Reserves a physical seat for one showtime as part of a booking.
/// </summary>
public sealed class BookedSeat : BaseEntity
{
    public Guid ShowtimeId { get; set; }
    public Guid SeatId { get; set; }
    public Guid BookingId { get; set; }

    public Showtime Showtime { get; set; } = null!;
    public Seat Seat { get; set; } = null!;
    public Booking Booking { get; set; } = null!;
}
