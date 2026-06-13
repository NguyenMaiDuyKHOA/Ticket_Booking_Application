using TicketBook.Domain.Common;
using TicketBook.Domain.Enums;

namespace TicketBook.Domain.Entities;

public sealed class Payment : BaseEntity
{
    public Guid BookingId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "VND";
    public string Provider { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public DateTimeOffset? PaidAt { get; set; }

    public Booking Booking { get; set; } = null!;
}
