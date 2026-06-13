using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Uploads;
using TicketBook.Application.Interfaces;

namespace TicketBook.Infrastructure.Services;

internal sealed class CloudinaryImageStorageService : IImageStorageService
{
    private readonly CloudinaryOptions _options;

    public CloudinaryImageStorageService(IOptions<CloudinaryOptions> options)
    {
        _options = options.Value;
    }

    public async Task<UploadImageResponse> UploadImageAsync(UploadImageRequest request, CancellationToken cancellationToken)
    {
        ValidateConfiguration();
        ValidateImage(request);

        var cloudinary = new Cloudinary(new Account(_options.CloudName, _options.ApiKey, _options.ApiSecret))
        {
            Api =
            {
                Secure = true
            }
        };

        var folder = BuildFolder(request.Folder);
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(request.FileName, request.Content),
            Folder = folder,
            Overwrite = false,
            UniqueFilename = true,
            UseFilename = true,
            Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        // Cloudinary receives the original file once; delivery optimization is handled through transformations.
        var result = await cloudinary.UploadAsync(uploadParams, cancellationToken);
        if (result.Error is not null)
        {
            throw new ValidationException(result.Error.Message);
        }

        if (result.SecureUrl is null)
        {
            throw new ValidationException("Cloudinary did not return a secure image URL.");
        }

        return new UploadImageResponse(
            result.PublicId,
            result.SecureUrl.ToString(),
            result.Width,
            result.Height,
            result.Bytes,
            result.Format);
    }

    private void ValidateConfiguration()
    {
        if (string.IsNullOrWhiteSpace(_options.CloudName)
            || string.IsNullOrWhiteSpace(_options.ApiKey)
            || string.IsNullOrWhiteSpace(_options.ApiSecret))
        {
            throw new ValidationException("Cloudinary configuration is missing.");
        }
    }

    private void ValidateImage(UploadImageRequest request)
    {
        if (request.Length == 0)
        {
            throw new ValidationException("Image file is required.");
        }

        if (request.Length > _options.MaxFileSizeBytes)
        {
            throw new ValidationException($"Image file must be smaller than {_options.MaxFileSizeBytes / 1024 / 1024}MB.");
        }

        if (!_options.AllowedContentTypes.Contains(request.ContentType, StringComparer.OrdinalIgnoreCase))
        {
            throw new ValidationException("Only JPEG, PNG and WebP images are supported.");
        }
    }

    private string BuildFolder(string? requestedFolder)
    {
        var baseFolder = string.IsNullOrWhiteSpace(_options.Folder) ? "ticketbook" : _options.Folder.Trim('/');
        var childFolder = SanitizeFolderSegment(requestedFolder);

        return string.IsNullOrWhiteSpace(childFolder) ? baseFolder : $"{baseFolder}/{childFolder}";
    }

    private static string? SanitizeFolderSegment(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var safeCharacters = value
            .Trim()
            .ToLowerInvariant()
            .Where(character => char.IsLetterOrDigit(character) || character is '-' or '_')
            .ToArray();

        return safeCharacters.Length == 0 ? null : new string(safeCharacters);
    }
}
