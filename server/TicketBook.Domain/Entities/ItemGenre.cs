namespace TicketBook.Domain.Entities;

/// <summary>
/// Connects catalog items to genres without forcing a single category into item metadata.
/// </summary>
public sealed class ItemGenre
{
    public Guid ItemId { get; set; }
    public Guid GenreId { get; set; }

    public Item Item { get; set; } = null!;
    public Genre Genre { get; set; } = null!;
}
