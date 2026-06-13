using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Represents a catalog workflow status such as draft, published, unpublished, or archived.
/// </summary>
public sealed class ItemStatus : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Item> Items { get; set; } = new List<Item>();
}
