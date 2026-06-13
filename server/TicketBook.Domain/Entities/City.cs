using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Represents a normalized city used by venues and event metadata.
/// </summary>
public sealed class City : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    public ICollection<Venue> Venues { get; set; } = new List<Venue>();
}
