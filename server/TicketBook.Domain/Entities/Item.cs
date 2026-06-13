using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Represents the shared catalog item for cinema, events, concerts, sports, live shows, and future ticket types.
/// </summary>
public sealed class Item : BaseEntity
{
    public Guid ItemTypeId { get; set; }
    public Guid ItemStatusId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string? PosterUrl { get; set; }

    /// <summary>
    /// Stores type-specific details as JSON so the catalog can evolve without creating a table per item type.
    /// </summary>
    public string Metadata { get; set; } = "{}";

    public ItemType ItemType { get; set; } = null!;
    public ItemStatus ItemStatus { get; set; } = null!;
    public ICollection<ItemGenre> ItemGenres { get; set; } = new List<ItemGenre>();
    public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
