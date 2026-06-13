using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.DTOs.Halls;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/halls")]
public sealed class HallsController : ControllerBase
{
    private readonly IHallService _hallService;

    public HallsController(IHallService hallService)
    {
        _hallService = hallService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<HallDto>>> GetHalls(
        [FromQuery] Guid? venueId,
        [FromQuery] Guid? itemTypeId,
        CancellationToken cancellationToken)
    {
        return Ok(await _hallService.GetAllAsync(venueId, itemTypeId, cancellationToken));
    }
}
