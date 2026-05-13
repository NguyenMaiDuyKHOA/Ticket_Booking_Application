using TicketBook.Domain.Common;
using TicketBook.Domain.Enums;

namespace TicketBook.Domain.Entities;

public sealed class Seat : BaseEntity
{
    public Guid ShowtimeId { get; set; }
    public string SeatNumber { get; set; } = string.Empty;
    public SeatType SeatType { get; set; } = SeatType.Standard;
    public bool IsBooked { get; set; }

    public Showtime Showtime { get; set; } = null!;
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
