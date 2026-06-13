namespace TicketBook.Application.DTOs.Genres;

/// <summary>
/// Read model used by management screens when assigning type-specific genres to items.
/// </summary>
public sealed record GenreDto(
    Guid Id,
    Guid ItemTypeId,
    string ItemTypeSlug,
    string Name,
    string Slug,
    string? Description);
