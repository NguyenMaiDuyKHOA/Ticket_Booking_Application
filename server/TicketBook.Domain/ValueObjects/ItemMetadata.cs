namespace TicketBook.Domain.ValueObjects;

/// <summary>
/// Marker contract for typed metadata stored in Item.Metadata.
/// </summary>
public interface IItemMetadata
{
}

/// <summary>
/// Metadata shape for cinema items shown in the CGV booking flow.
/// </summary>
public sealed record CinemaItemMetadata(
    decimal Score,
    int Duration,
    string AgeRating,
    string Format,
    IReadOnlyList<Guid> SupportedHallTypeIds) : IItemMetadata;

/// <summary>
/// Metadata shape for general events.
/// </summary>
public sealed record EventItemMetadata(
    Guid CityId,
    string DetailLocation) : IItemMetadata;
