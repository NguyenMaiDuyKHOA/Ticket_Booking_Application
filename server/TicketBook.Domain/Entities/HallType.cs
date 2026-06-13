using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Defines a reusable hall type such as Standard, IMAX, VIP, Stage, or Stadium.
/// </summary>
public sealed class HallType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    public ICollection<Hall> Halls { get; set; } = new List<Hall>();
}
