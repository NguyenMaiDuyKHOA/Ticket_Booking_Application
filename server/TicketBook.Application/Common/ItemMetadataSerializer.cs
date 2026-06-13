using System.Text.Json;
using TicketBook.Domain.Constants;
using TicketBook.Domain.ValueObjects;

namespace TicketBook.Application.Common;

/// <summary>
/// Validates and serializes type-specific Item.Metadata payloads.
/// </summary>
public static class ItemMetadataSerializer
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    /// <summary>
    /// Converts incoming metadata into the canonical JSON shape expected for the selected item type.
    /// </summary>
    public static string Normalize(string itemTypeSlug, string? metadataJson)
    {
        var normalizedSlug = itemTypeSlug.Trim().ToLowerInvariant();
        var json = string.IsNullOrWhiteSpace(metadataJson) ? "{}" : metadataJson;

        return normalizedSlug switch
        {
            ItemTypeSlugs.Cinema => SerializeCinemaMetadata(json),
            ItemTypeSlugs.Event => SerializeEventMetadata(json),
            _ => NormalizeGenericMetadata(json)
        };
    }

    /// <summary>
    /// Deserializes metadata into a typed model when the item type has a known schema.
    /// </summary>
    public static IItemMetadata? DeserializeKnownMetadata(string itemTypeSlug, string metadataJson)
    {
        var normalizedSlug = itemTypeSlug.Trim().ToLowerInvariant();

        return normalizedSlug switch
        {
            ItemTypeSlugs.Cinema => JsonSerializer.Deserialize<CinemaItemMetadata>(metadataJson, JsonOptions),
            ItemTypeSlugs.Event => JsonSerializer.Deserialize<EventItemMetadata>(metadataJson, JsonOptions),
            _ => null
        };
    }

    private static string SerializeCinemaMetadata(string metadataJson)
    {
        var metadata = DeserializeRequired<CinemaItemMetadata>(metadataJson);

        if (metadata.Score is < 0 or > 10)
        {
            throw new ValidationException("Cinema score must be between 0 and 10.");
        }

        if (metadata.Duration <= 0)
        {
            throw new ValidationException("Cinema duration must be greater than zero.");
        }

        EnsureRequired(metadata.AgeRating, "Cinema age rating");
        EnsureRequired(metadata.Format, "Cinema format");
        if (metadata.SupportedHallTypeIds is null || metadata.SupportedHallTypeIds.Count == 0)
        {
            throw new ValidationException("Cinema item must support at least one hall type.");
        }

        return JsonSerializer.Serialize(metadata, JsonOptions);
    }

    private static string SerializeEventMetadata(string metadataJson)
    {
        var metadata = DeserializeRequired<EventItemMetadata>(metadataJson);

        if (metadata.CityId == Guid.Empty)
        {
            throw new ValidationException("Event city is required.");
        }

        EnsureRequired(metadata.DetailLocation, "Event detail location");

        return JsonSerializer.Serialize(metadata, JsonOptions);
    }

    private static string NormalizeGenericMetadata(string metadataJson)
    {
        using var document = ParseJson(metadataJson);
        if (document.RootElement.ValueKind != JsonValueKind.Object)
        {
            throw new ValidationException("Metadata must be a JSON object.");
        }

        return document.RootElement.GetRawText();
    }

    private static TMetadata DeserializeRequired<TMetadata>(string metadataJson)
    {
        try
        {
            var metadata = JsonSerializer.Deserialize<TMetadata>(metadataJson, JsonOptions);
            return metadata ?? throw new ValidationException("Metadata is required.");
        }
        catch (JsonException)
        {
            throw new ValidationException("Metadata is invalid JSON.");
        }
    }

    private static JsonDocument ParseJson(string metadataJson)
    {
        try
        {
            return JsonDocument.Parse(metadataJson);
        }
        catch (JsonException)
        {
            throw new ValidationException("Metadata is invalid JSON.");
        }
    }

    private static void EnsureRequired(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ValidationException($"{fieldName} is required.");
        }
    }
}
