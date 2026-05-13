using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

public sealed class Ticket : BaseEntity
{
    public Guid BookingId { get; set; }
    public Guid SeatId { get; set; }
    public decimal Price { get; set; }

    public Booking Booking { get; set; } = null!;
    public Seat Seat { get; set; } = null!;
}
