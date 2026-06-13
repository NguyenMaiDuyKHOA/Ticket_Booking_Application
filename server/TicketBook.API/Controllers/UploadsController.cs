using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Uploads;
using TicketBook.Application.Interfaces;

namespace TicketBook.API.Controllers;

/// <summary>
/// Provides protected media upload endpoints for catalog management.
/// </summary>
[ApiController]
[Route("api/uploads")]
public sealed class UploadsController : ControllerBase
{
    private const long MaxImageUploadBytes = 10 * 1024 * 1024;
    private readonly IImageStorageService _imageStorageService;

    public UploadsController(IImageStorageService imageStorageService)
    {
        _imageStorageService = imageStorageService;
    }

    /// <summary>
    /// Uploads a catalog image to the configured external image store.
    /// </summary>
    [Authorize(Roles = "Admin,Agency")]
    [HttpPost("images")]
    [RequestSizeLimit(MaxImageUploadBytes)]
    public async Task<ActionResult<UploadImageResponse>> UploadImage(
        IFormFile? file,
        [FromForm] string? folder,
        CancellationToken cancellationToken)
    {
        if (file is null)
        {
            throw new ValidationException("Image file is required.");
        }

        await using var stream = file.OpenReadStream();
        var response = await _imageStorageService.UploadImageAsync(
            new UploadImageRequest(stream, file.FileName, file.ContentType, file.Length, folder),
            cancellationToken);

        return Ok(response);
    }
}
