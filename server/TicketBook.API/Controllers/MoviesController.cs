using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Movies;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/movies")]
public sealed class MoviesController : ControllerBase
{
    private readonly IMovieService _movieService;

    public MoviesController(IMovieService movieService)
    {
        _movieService = movieService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<MovieDto>>> GetMovies([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, CancellationToken cancellationToken = default)
    {
        return Ok(await _movieService.GetPagedAsync(page, pageSize, search, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MovieDto>> GetMovie(Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _movieService.GetByIdAsync(id, cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<MovieDto>> CreateMovie(CreateMovieRequest request, CancellationToken cancellationToken)
    {
        var movie = await _movieService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<MovieDto>> UpdateMovie(Guid id, UpdateMovieRequest request, CancellationToken cancellationToken)
    {
        return Ok(await _movieService.UpdateAsync(id, request, cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteMovie(Guid id, CancellationToken cancellationToken)
    {
        await _movieService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
