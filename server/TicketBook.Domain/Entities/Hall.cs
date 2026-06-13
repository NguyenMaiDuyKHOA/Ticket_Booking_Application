using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Represents a bookable space inside a venue, such as cinema hall, concert stage, stadium section, or performance room.
/// </summary>
public sealed class Hall : BaseEntity
{
    public Guid VenueId { get; set; }
    public Guid HallTypeId { get; set; }
    public Guid ItemTypeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }

    public Venue Venue { get; set; } = null!;
    public HallType HallType { get; set; } = null!;
    public ItemType ItemType { get; set; } = null!;
    public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}
