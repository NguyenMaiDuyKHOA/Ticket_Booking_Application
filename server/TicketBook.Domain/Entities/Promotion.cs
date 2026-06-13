using TicketBook.Domain.Common;
using TicketBook.Domain.Enums;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Represents a coupon or campaign discount that can be applied to eligible bookings.
/// </summary>
public sealed class Promotion : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinimumOrderAmount { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public int? UsageLimit { get; set; }
    public int UsedCount { get; set; }
    public DateTimeOffset StartsAt { get; set; }
    public DateTimeOffset EndsAt { get; set; }
    public PromotionStatus Status { get; set; } = PromotionStatus.Draft;

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
