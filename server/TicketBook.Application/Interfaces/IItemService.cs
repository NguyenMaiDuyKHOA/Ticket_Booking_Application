using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Items;

namespace TicketBook.Application.Interfaces;

/// <summary>
/// Coordinates catalog item write workflows for protected management features.
/// </summary>
public interface IItemService
{
    /// <summary>
    /// Returns catalog items for management and public listing screens.
    /// </summary>
    Task<PagedResult<ItemDto>> GetAsync(ItemQuery query, CancellationToken cancellationToken);

    /// <summary>
    /// Returns one catalog item by identifier.
    /// </summary>
    Task<ItemDto> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    /// <summary>
    /// Returns one catalog item by public slug for SEO-friendly detail pages.
    /// </summary>
    Task<ItemDto> GetBySlugAsync(string slug, CancellationToken cancellationToken);

    /// <summary>
    /// Creates a generic catalog item and assigns type-compatible genres.
    /// </summary>
    Task<ItemDto> CreateAsync(CreateItemRequest request, CancellationToken cancellationToken);
}
