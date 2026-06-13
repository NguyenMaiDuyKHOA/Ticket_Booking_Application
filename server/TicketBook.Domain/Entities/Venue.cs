using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Represents a physical or virtual place that can host one or more halls, stages, fields, or rooms.
/// </summary>
public sealed class Venue : BaseEntity
{
    public Guid CityId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    public City City { get; set; } = null!;
    public ICollection<Hall> Halls { get; set; } = new List<Hall>();
}
