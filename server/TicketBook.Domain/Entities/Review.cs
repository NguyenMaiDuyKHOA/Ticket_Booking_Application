using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Captures user feedback for an item after purchase or attendance rules are satisfied by the application layer.
/// </summary>
public sealed class Review : BaseEntity
{
    public Guid ItemId { get; set; }
    public Guid UserId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }

    public Item Item { get; set; } = null!;
    public User User { get; set; } = null!;
}
