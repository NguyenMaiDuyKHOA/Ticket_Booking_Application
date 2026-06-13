using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Classifies catalog items within an item type so management screens can show relevant genre choices.
/// </summary>
public sealed class Genre : BaseEntity
{
    public Guid ItemTypeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ItemType ItemType { get; set; } = null!;
    public ICollection<ItemGenre> ItemGenres { get; set; } = new List<ItemGenre>();
}
