using TicketBook.Domain.Common;
using TicketBook.Domain.Enums;

namespace TicketBook.Domain.Entities;

public sealed class Booking : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ShowtimeId { get; set; }
    public Guid? PromotionId { get; set; }
    public string BookingNumber { get; set; } = string.Empty;
    public decimal SubtotalPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    public User User { get; set; } = null!;
    public Showtime Showtime { get; set; } = null!;
    public Promotion? Promotion { get; set; }
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    public ICollection<BookedSeat> BookedSeats { get; set; } = new List<BookedSeat>();
    public Payment? Payment { get; set; }
}
