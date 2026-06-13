namespace TicketBook.Application.DTOs.Uploads;

/// <summary>
/// Represents an image stream submitted by a trusted back-office user.
/// </summary>
public sealed record UploadImageRequest(
    Stream Content,
    string FileName,
    string ContentType,
    long Length,
    string? Folder);

/// <summary>
/// Contains the Cloudinary asset identifiers that the catalog can persist later.
/// </summary>
public sealed record UploadImageResponse(
    string PublicId,
    string SecureUrl,
    int Width,
    int Height,
    long Bytes,
    string Format);
