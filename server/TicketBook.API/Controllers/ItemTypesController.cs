using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.DTOs.ItemTypes;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/item-types")]
public sealed class ItemTypesController : ControllerBase
{
    private readonly IItemTypeService _itemTypeService;

    public ItemTypesController(IItemTypeService itemTypeService)
    {
        _itemTypeService = itemTypeService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ItemTypeDto>>> GetItemTypes(CancellationToken cancellationToken)
    {
        return Ok(await _itemTypeService.GetAllAsync(cancellationToken));
    }
}
