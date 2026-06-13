using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Represents a physical seat inside a hall. Availability is calculated per showtime through tickets, not stored on the seat itself.
/// </summary>
public sealed class Seat : BaseEntity
{
    public Guid HallId { get; set; }
    public Guid SeatTypeId { get; set; }
    public string Row { get; set; } = string.Empty;
    public int Number { get; set; }

    public Hall Hall { get; set; } = null!;
    public SeatType SeatType { get; set; } = null!;
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    public ICollection<BookedSeat> BookedSeats { get; set; } = new List<BookedSeat>();
}
