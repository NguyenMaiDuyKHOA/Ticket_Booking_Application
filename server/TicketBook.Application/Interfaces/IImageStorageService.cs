using TicketBook.Application.DTOs.Uploads;

namespace TicketBook.Application.Interfaces;

/// <summary>
/// Stores catalog images in an external media provider.
/// </summary>
public interface IImageStorageService
{
    /// <summary>
    /// Uploads an image and returns the public delivery URL plus provider metadata.
    /// </summary>
    Task<UploadImageResponse> UploadImageAsync(UploadImageRequest request, CancellationToken cancellationToken);
}
