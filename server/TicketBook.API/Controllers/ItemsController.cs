using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Items;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

/// <summary>
/// Provides protected endpoints for managing generic catalog items.
/// </summary>
[ApiController]
[Route("api/items")]
public sealed class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemsController(IItemService itemService)
    {
        _itemService = itemService;
    }

    /// <summary>
    /// Returns catalog items from the database for listing screens.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<ItemDto>>> GetItems(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? itemTypeSlug = null,
        [FromQuery] string? statusSlug = null,
        CancellationToken cancellationToken = default)
    {
        return Ok(await _itemService.GetAsync(new ItemQuery(page, pageSize, itemTypeSlug, statusSlug), cancellationToken));
    }

    /// <summary>
    /// Returns one catalog item from the database.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ItemDto>> GetItem(Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _itemService.GetByIdAsync(id, cancellationToken));
    }

    /// <summary>
    /// Returns one catalog item by public slug for clean detail URLs.
    /// </summary>
    [HttpGet("by-slug/{slug}")]
    public async Task<ActionResult<ItemDto>> GetItemBySlug(string slug, CancellationToken cancellationToken)
    {
        return Ok(await _itemService.GetBySlugAsync(slug, cancellationToken));
    }

    /// <summary>
    /// Creates a catalog item for any supported item type.
    /// </summary>
    [Authorize(Roles = "Admin,Agency")]
    [HttpPost]
    public async Task<ActionResult<ItemDto>> CreateItem(CreateItemRequest request, CancellationToken cancellationToken)
    {
        var item = await _itemService.CreateAsync(request, cancellationToken);
        return Created($"/api/items/by-slug/{item.Slug}", item);
    }
}
