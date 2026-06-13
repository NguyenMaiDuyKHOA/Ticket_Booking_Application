using TicketBook.Application.DTOs.Genres;

namespace TicketBook.Application.DTOs.Items;

/// <summary>
/// Query parameters for catalog item listing screens.
/// </summary>
public sealed record ItemQuery(
    int Page = 1,
    int PageSize = 20,
    string? ItemTypeSlug = null,
    string? StatusSlug = null);

/// <summary>
/// Command payload used by management clients to create a generic catalog item.
/// </summary>
public sealed record CreateItemRequest(
    Guid ItemTypeId,
    Guid ItemStatusId,
    IReadOnlyCollection<Guid> GenreIds,
    string Title,
    string Slug,
    string Description,
    DateOnly StartDate,
    decimal Price,
    string? ImageUrl,
    string? PosterUrl,
    string? Metadata);

/// <summary>
/// Catalog item read model returned after a management write succeeds.
/// </summary>
public sealed record ItemDto(
    Guid Id,
    Guid ItemTypeId,
    string ItemTypeSlug,
    Guid ItemStatusId,
    string ItemStatusSlug,
    IReadOnlyList<GenreDto> Genres,
    string Title,
    string Slug,
    string Description,
    DateOnly StartDate,
    decimal Price,
    string? ImageUrl,
    string? PosterUrl,
    string Metadata,
    int ShowtimeCount,
    DateTimeOffset CreatedAt);
