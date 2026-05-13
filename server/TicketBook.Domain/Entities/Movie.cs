using TicketBook.Domain.Common;
using TicketBook.Domain.Enums;

namespace TicketBook.Domain.Entities;

public sealed class Movie : BaseEntity
{
    public MovieType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string Genre { get; set; } = string.Empty;
    public string? PosterUrl { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public string AgeRating { get; set; } = string.Empty;

    public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}
