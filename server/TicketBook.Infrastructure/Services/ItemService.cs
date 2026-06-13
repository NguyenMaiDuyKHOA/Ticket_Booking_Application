using Microsoft.EntityFrameworkCore;
using Ganss.Xss;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Genres;
using TicketBook.Application.DTOs.Items;
using TicketBook.Application.Interfaces;
using TicketBook.Domain.Entities;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

/// <summary>
/// Handles protected catalog item write workflows.
/// </summary>
public sealed class ItemService : IItemService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly HtmlSanitizer _htmlSanitizer = CreateDescriptionSanitizer();

    public ItemService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Reads catalog items with bounded paging so admin screens never load the whole catalog at once.
    /// </summary>
    public async Task<PagedResult<ItemDto>> GetAsync(ItemQuery query, CancellationToken cancellationToken)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var itemTypeSlug = NormalizeOptionalFilter(query.ItemTypeSlug);
        var statusSlug = NormalizeOptionalFilter(query.StatusSlug);

        var itemsQuery = _dbContext.Items
            .AsNoTracking()
            .Include(item => item.ItemType)
            .Include(item => item.ItemStatus)
            .Include(item => item.ItemGenres).ThenInclude(itemGenre => itemGenre.Genre)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(itemTypeSlug))
        {
            itemsQuery = itemsQuery.Where(item => item.ItemType.Slug == itemTypeSlug);
        }

        if (!string.IsNullOrWhiteSpace(statusSlug))
        {
            itemsQuery = itemsQuery.Where(item => item.ItemStatus.Slug == statusSlug);
        }

        var totalCount = await itemsQuery.CountAsync(cancellationToken);
        var items = await itemsQuery
            .OrderByDescending(item => item.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        var showtimeCounts = await GetShowtimeCountsAsync(items.Select(item => item.Id), cancellationToken);

        return new PagedResult<ItemDto>(
            items.Select(item => ToDto(item, showtimeCounts.GetValueOrDefault(item.Id))).ToList(),
            page,
            pageSize,
            totalCount);
    }

    /// <summary>
    /// Reads one catalog item for detail pages.
    /// </summary>
    public async Task<ItemDto> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var item = await ItemDetailsQuery()
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new NotFoundException("Item was not found.");

        return ToDto(item, await GetShowtimeCountAsync(item.Id, cancellationToken));
    }

    /// <summary>
    /// Reads one catalog item by slug for public URLs while keeping database identifiers internal.
    /// </summary>
    public async Task<ItemDto> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var normalizedSlug = NormalizeSlug(slug);
        var item = await ItemDetailsQuery()
            .SingleOrDefaultAsync(candidate => candidate.Slug == normalizedSlug, cancellationToken)
            ?? throw new NotFoundException("Item was not found.");

        return ToDto(item, await GetShowtimeCountAsync(item.Id, cancellationToken));
    }

    /// <summary>
    /// Creates an item after enforcing catalog invariants that should not live in API controllers.
    /// </summary>
    public async Task<ItemDto> CreateAsync(CreateItemRequest request, CancellationToken cancellationToken)
    {
        var title = RequireText(request.Title, "Title");
        var slug = NormalizeSlug(request.Slug);
        var description = SanitizeDescription(request.Description);

        if (request.ItemTypeId == Guid.Empty)
        {
            throw new ValidationException("Item type is required.");
        }

        if (request.ItemStatusId == Guid.Empty)
        {
            throw new ValidationException("Item status is required.");
        }

        if (request.Price < 0)
        {
            throw new ValidationException("Ticket price cannot be negative.");
        }

        var itemType = await _dbContext.ItemTypes
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.Id == request.ItemTypeId, cancellationToken)
            ?? throw new NotFoundException("Item type was not found.");

        var itemStatus = await _dbContext.ItemStatuses
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.Id == request.ItemStatusId, cancellationToken)
            ?? throw new NotFoundException("Item status was not found.");

        if (await _dbContext.Items.AnyAsync(candidate => candidate.Slug == slug, cancellationToken))
        {
            throw new ConflictException("An item with this slug already exists.");
        }

        var genreIds = request.GenreIds
            .Where(genreId => genreId != Guid.Empty)
            .Distinct()
            .ToList();

        var genres = await _dbContext.Genres
            .Where(genre => genreIds.Contains(genre.Id))
            .OrderBy(genre => genre.Name)
            .ToListAsync(cancellationToken);

        if (genres.Count != genreIds.Count)
        {
            throw new NotFoundException("One or more genres were not found.");
        }

        if (genres.Any(genre => genre.ItemTypeId != itemType.Id))
        {
            throw new ValidationException("Selected genres must belong to the selected item type.");
        }

        var normalizedMetadata = ItemMetadataSerializer.Normalize(itemType.Slug, request.Metadata);
        await ValidateMetadataReferencesAsync(itemType.Slug, normalizedMetadata, cancellationToken);

        var item = new Item
        {
            ItemTypeId = itemType.Id,
            ItemStatusId = itemStatus.Id,
            Title = title,
            Slug = slug,
            Description = description,
            StartDate = request.StartDate,
            Price = request.Price,
            ImageUrl = NormalizeOptionalUrl(request.ImageUrl),
            PosterUrl = NormalizeOptionalUrl(request.PosterUrl),
            // Metadata remains JSONB in the database, but the Application serializer owns the schema rules per item type.
            Metadata = normalizedMetadata,
            ItemGenres = genreIds.Select(genreId => new ItemGenre { GenreId = genreId }).ToList()
        };

        _dbContext.Items.Add(item);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToDto(item, itemType.Slug, itemStatus.Slug, genres, 0);
    }

    private static ItemDto ToDto(Item item, int showtimeCount)
    {
        var genres = item.ItemGenres
            .Select(itemGenre => itemGenre.Genre)
            .OrderBy(genre => genre.Name)
            .ToList();

        return ToDto(item, item.ItemType.Slug, item.ItemStatus.Slug, genres, showtimeCount);
    }

    private IQueryable<Item> ItemDetailsQuery() =>
        _dbContext.Items
            .AsNoTracking()
            .Include(candidate => candidate.ItemType)
            .Include(candidate => candidate.ItemStatus)
            .Include(candidate => candidate.ItemGenres).ThenInclude(itemGenre => itemGenre.Genre);

    private static ItemDto ToDto(Item item, string itemTypeSlug, string itemStatusSlug, IReadOnlyCollection<Genre> genres, int showtimeCount)
    {
        var genreDtos = genres
            .Select(genre => new GenreDto(
                genre.Id,
                genre.ItemTypeId,
                itemTypeSlug,
                genre.Name,
                genre.Slug,
                genre.Description))
            .ToList();

        return new ItemDto(
            item.Id,
            item.ItemTypeId,
            itemTypeSlug,
            item.ItemStatusId,
            itemStatusSlug,
            genreDtos,
            item.Title,
            item.Slug,
            item.Description,
            item.StartDate,
            item.Price,
            item.ImageUrl,
            item.PosterUrl,
            item.Metadata,
            showtimeCount,
            item.CreatedAt);
    }

    private async Task<Dictionary<Guid, int>> GetShowtimeCountsAsync(IEnumerable<Guid> itemIds, CancellationToken cancellationToken)
    {
        var ids = itemIds.Distinct().ToArray();
        if (ids.Length == 0)
        {
            return new Dictionary<Guid, int>();
        }

        return await _dbContext.Showtimes
            .AsNoTracking()
            .Where(showtime => ids.Contains(showtime.ItemId))
            .GroupBy(showtime => showtime.ItemId)
            .Select(group => new { ItemId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(group => group.ItemId, group => group.Count, cancellationToken);
    }

    private async Task<int> GetShowtimeCountAsync(Guid itemId, CancellationToken cancellationToken)
    {
        return await _dbContext.Showtimes
            .AsNoTracking()
            .CountAsync(showtime => showtime.ItemId == itemId, cancellationToken);
    }

    private static string RequireText(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ValidationException($"{fieldName} is required.");
        }

        return value.Trim();
    }

    private string SanitizeDescription(string value)
    {
        var html = RequireText(value, "Description");
        var sanitizedHtml = _htmlSanitizer.Sanitize(html);

        if (string.IsNullOrWhiteSpace(sanitizedHtml))
        {
            throw new ValidationException("Description must contain safe display content.");
        }

        return sanitizedHtml.Trim();
    }

    private async Task ValidateMetadataReferencesAsync(string itemTypeSlug, string metadataJson, CancellationToken cancellationToken)
    {
        var metadata = ItemMetadataSerializer.DeserializeKnownMetadata(itemTypeSlug, metadataJson);

        if (metadata is TicketBook.Domain.ValueObjects.EventItemMetadata eventMetadata)
        {
            var cityExists = await _dbContext.Cities.AnyAsync(city => city.Id == eventMetadata.CityId, cancellationToken);
            if (!cityExists)
            {
                throw new NotFoundException("Event city was not found.");
            }
        }

        if (metadata is TicketBook.Domain.ValueObjects.CinemaItemMetadata cinemaMetadata)
        {
            var requestedHallTypeIds = cinemaMetadata.SupportedHallTypeIds.Distinct().ToArray();
            var existingHallTypeCount = await _dbContext.HallTypes
                .AsNoTracking()
                .CountAsync(hallType => requestedHallTypeIds.Contains(hallType.Id), cancellationToken);

            if (existingHallTypeCount != requestedHallTypeIds.Length)
            {
                throw new NotFoundException("One or more cinema hall types were not found.");
            }
        }
    }

    private static HtmlSanitizer CreateDescriptionSanitizer()
    {
        var sanitizer = new HtmlSanitizer();

        // The description field is authored by admins/agencies as rich HTML. Keep formatting tags and safe media,
        // while still removing scripts, inline event handlers, javascript: URLs, and other XSS vectors.
        sanitizer.AllowedTags.UnionWith(new[]
        {
            "a", "blockquote", "br", "caption", "col", "colgroup", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
            "hr", "img", "li", "ol", "p", "span", "strong", "table", "tbody", "td", "th", "thead", "tr", "u", "ul"
        });
        sanitizer.AllowedAttributes.UnionWith(new[]
        {
            "alt", "class", "colspan", "href", "rel", "rowspan", "src", "style", "target", "title"
        });
        sanitizer.AllowedCssProperties.UnionWith(new[]
        {
            "margin-left", "text-align"
        });
        sanitizer.AllowedSchemes.Add("http");
        sanitizer.AllowedSchemes.Add("https");

        return sanitizer;
    }

    private static string NormalizeSlug(string value)
    {
        var slug = RequireText(value, "Slug").Trim().ToLowerInvariant();

        if (slug.Any(character => !char.IsAsciiLetterOrDigit(character) && character != '-'))
        {
            throw new ValidationException("Slug can only contain lowercase letters, numbers and hyphens.");
        }

        return slug;
    }

    private static string? NormalizeOptionalUrl(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static string? NormalizeOptionalFilter(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim().ToLowerInvariant();
    }
}
