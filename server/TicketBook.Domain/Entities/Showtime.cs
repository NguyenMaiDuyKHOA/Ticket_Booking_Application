using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

public sealed class Showtime : BaseEntity
{
    public Guid ItemId { get; set; }
    public Guid HallId { get; set; }
    public Guid ShowtimeStatusId { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public decimal Price { get; set; }

    public Item Item { get; set; } = null!;
    public Hall Hall { get; set; } = null!;
    public ShowtimeStatus ShowtimeStatus { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<BookedSeat> BookedSeats { get; set; } = new List<BookedSeat>();
}
