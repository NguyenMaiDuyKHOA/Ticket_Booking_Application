using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.DTOs.ShowtimeStatuses;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/showtime-statuses")]
public sealed class ShowtimeStatusesController : ControllerBase
{
    private readonly IShowtimeStatusService _showtimeStatusService;

    public ShowtimeStatusesController(IShowtimeStatusService showtimeStatusService)
    {
        _showtimeStatusService = showtimeStatusService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ShowtimeStatusDto>>> GetShowtimeStatuses(CancellationToken cancellationToken)
    {
        return Ok(await _showtimeStatusService.GetAllAsync(cancellationToken));
    }
}
