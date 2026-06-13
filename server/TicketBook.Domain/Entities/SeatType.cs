using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Defines a reusable seat type used for pricing and layout decisions.
/// </summary>
public sealed class SeatType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    public ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
