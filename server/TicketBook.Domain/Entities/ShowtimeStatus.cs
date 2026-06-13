using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Represents the operational state of a showtime, such as scheduled, sold out, cancelled, or completed.
/// </summary>
public sealed class ShowtimeStatus : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}
