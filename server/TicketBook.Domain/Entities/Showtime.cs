using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

public sealed class Showtime : BaseEntity
{
    public Guid MovieId { get; set; }
    public Guid CinemaId { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public decimal StandardSeatPrice { get; set; }
    public decimal VipSeatPrice { get; set; }

    public Movie Movie { get; set; } = null!;
    public Cinema Cinema { get; set; } = null!;
    public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
