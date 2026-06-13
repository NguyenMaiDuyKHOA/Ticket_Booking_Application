using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Defines a catalog item type such as cinema, event, concert, sport, live show, tour, or future types.
/// </summary>
public sealed class ItemType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Item> Items { get; set; } = new List<Item>();
    public ICollection<Genre> Genres { get; set; } = new List<Genre>();
    public ICollection<Hall> Halls { get; set; } = new List<Hall>();
}
