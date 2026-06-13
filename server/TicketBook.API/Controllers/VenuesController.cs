using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.DTOs.Venues;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

[ApiController]
[Route("api/venues")]
public sealed class VenuesController : ControllerBase
{
    private readonly IVenueService _venueService;

    public VenuesController(IVenueService venueService)
    {
        _venueService = venueService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<VenueDto>>> GetVenues(CancellationToken cancellationToken)
    {
        return Ok(await _venueService.GetAllAsync(cancellationToken));
    }
}
