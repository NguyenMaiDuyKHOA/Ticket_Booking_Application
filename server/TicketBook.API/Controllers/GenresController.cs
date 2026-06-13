using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.DTOs.Genres;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

/// <summary>
/// Exposes reusable catalog genres for item management workflows.
/// </summary>
[ApiController]
[Route("api/genres")]
public sealed class GenresController : ControllerBase
{
    private readonly IGenreService _genreService;

    public GenresController(IGenreService genreService)
    {
        _genreService = genreService;
    }

    /// <summary>
    /// Returns active genres that can be assigned to catalog items.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GenreDto>>> GetGenres(CancellationToken cancellationToken)
    {
        return Ok(await _genreService.GetAllAsync(cancellationToken));
    }
}
