using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.DTOs.HallTypes;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/hall-types")]
public sealed class HallTypesController : ControllerBase
{
    private readonly IHallTypeService _hallTypeService;

    public HallTypesController(IHallTypeService hallTypeService)
    {
        _hallTypeService = hallTypeService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<HallTypeDto>>> GetHallTypes(CancellationToken cancellationToken)
    {
        return Ok(await _hallTypeService.GetAllAsync(cancellationToken));
    }
}
