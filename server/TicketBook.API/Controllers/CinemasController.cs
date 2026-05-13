using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Cinemas;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/cinemas")]
public sealed class CinemasController : ControllerBase
{
    private readonly ICinemaService _cinemaService;

    public CinemasController(ICinemaService cinemaService)
    {
        _cinemaService = cinemaService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<CinemaDto>>> GetCinemas([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? city = null, CancellationToken cancellationToken = default)
    {
        return Ok(await _cinemaService.GetPagedAsync(page, pageSize, city, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CinemaDto>> GetCinema(Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _cinemaService.GetByIdAsync(id, cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<CinemaDto>> CreateCinema(CreateCinemaRequest request, CancellationToken cancellationToken)
    {
        var cinema = await _cinemaService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetCinema), new { id = cinema.Id }, cinema);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CinemaDto>> UpdateCinema(Guid id, UpdateCinemaRequest request, CancellationToken cancellationToken)
    {
        return Ok(await _cinemaService.UpdateAsync(id, request, cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCinema(Guid id, CancellationToken cancellationToken)
    {
        await _cinemaService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
