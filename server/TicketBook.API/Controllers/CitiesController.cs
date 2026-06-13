using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.DTOs.Cities;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

/// <summary>
/// Provides normalized city options for item and venue forms.
/// </summary>
[ApiController]
[Route("api/cities")]
public sealed class CitiesController : ControllerBase
{
    private readonly ICityService _cityService;

    public CitiesController(ICityService cityService)
    {
        _cityService = cityService;
    }

    /// <summary>
    /// Returns city options ordered by display name.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CityDto>>> GetCities(CancellationToken cancellationToken)
    {
        return Ok(await _cityService.GetAllAsync(cancellationToken));
    }
}
