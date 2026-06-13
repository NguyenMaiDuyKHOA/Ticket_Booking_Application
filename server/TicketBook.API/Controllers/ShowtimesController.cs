using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Showtimes;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/showtimes")]
public sealed class ShowtimesController : ControllerBase
{
    private readonly IShowtimeService _showtimeService;

    public ShowtimesController(IShowtimeService showtimeService)
    {
        _showtimeService = showtimeService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ShowtimeDto>>> GetShowtimes(
        [FromQuery] Guid? itemTypeId,
        [FromQuery] Guid? itemId,
        [FromQuery] Guid? venueId,
        [FromQuery] Guid? hallId,
        [FromQuery] DateOnly? date,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        return Ok(await _showtimeService.GetPagedAsync(itemTypeId, itemId, venueId, hallId, date, page, pageSize, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ShowtimeDto>> GetShowtime(Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _showtimeService.GetByIdAsync(id, cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ShowtimeDto>> CreateShowtime(CreateShowtimeRequest request, CancellationToken cancellationToken)
    {
        var showtime = await _showtimeService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetShowtime), new { id = showtime.Id }, showtime);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ShowtimeDto>> UpdateShowtime(Guid id, UpdateShowtimeRequest request, CancellationToken cancellationToken)
    {
        return Ok(await _showtimeService.UpdateAsync(id, request, cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteShowtime(Guid id, CancellationToken cancellationToken)
    {
        await _showtimeService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
