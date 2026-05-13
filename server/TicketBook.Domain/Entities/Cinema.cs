using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

public sealed class Cinema : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}
