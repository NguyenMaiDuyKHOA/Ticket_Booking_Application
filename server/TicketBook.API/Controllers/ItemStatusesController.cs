using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.DTOs.ItemStatuses;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/item-statuses")]
public sealed class ItemStatusesController : ControllerBase
{
    private readonly IItemStatusService _itemStatusService;

    public ItemStatusesController(IItemStatusService itemStatusService)
    {
        _itemStatusService = itemStatusService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ItemStatusDto>>> GetItemStatuses(CancellationToken cancellationToken)
    {
        return Ok(await _itemStatusService.GetAllAsync(cancellationToken));
    }
}
