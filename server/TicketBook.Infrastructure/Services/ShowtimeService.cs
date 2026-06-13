using Microsoft.EntityFrameworkCore;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Showtimes;
using TicketBook.Application.Interfaces;
using TicketBook.Domain.Entities;
using TicketBook.Infrastructure.Persistence;
using TicketBook.Infrastructure.Persistence.Configurations;

namespace TicketBook.Infrastructure.Services;

public sealed class ShowtimeService : IShowtimeService
{
    private readonly ApplicationDbContext _dbContext;

    public ShowtimeService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<ShowtimeDto>> GetPagedAsync(
        Guid? itemTypeId,
        Guid? itemId,
        Guid? venueId,
        Guid? hallId,
        DateOnly? date,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        (page, pageSize) = NormalizePaging(page, pageSize);

        var query = ShowtimeDetailsQuery();

        if (itemTypeId.HasValue)
        {
            query = query.Where(showtime => showtime.Item.ItemTypeId == itemTypeId.Value);
        }

        if (itemId.HasValue)
        {
            query = query.Where(showtime => showtime.ItemId == itemId.Value);
        }

        if (venueId.HasValue)
        {
            query = query.Where(showtime => showtime.Hall.VenueId == venueId.Value);
        }

        if (hallId.HasValue)
        {
            query = query.Where(showtime => showtime.HallId == hallId.Value);
        }

        if (date.HasValue)
        {
            var start = new DateTimeOffset(date.Value.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
            var end = start.AddDays(1);
            query = query.Where(showtime => showtime.StartTime >= start && showtime.StartTime < end);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var showtimes = await query
            .OrderBy(showtime => showtime.StartTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        var items = showtimes.Select(showtime => showtime.ToDto()).ToList();

        return new PagedResult<ShowtimeDto>(items, page, pageSize, totalCount);
    }

    public async Task<ShowtimeDto> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var showtime = await ShowtimeDetailsQuery()
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken);

        return showtime?.ToDto() ?? throw new NotFoundException("Showtime was not found.");
    }

    public async Task<ShowtimeDto> CreateAsync(CreateShowtimeRequest request, CancellationToken cancellationToken)
    {
        var showtimeStatusId = await ValidateAndResolveShowtimeValuesAsync(
            request.ItemId,
            request.HallId,
            request.ShowtimeStatusId,
            cancellationToken);
        ValidateShowtimeRange(request.StartTime, request.EndTime, request.Price);
        await EnsureHallDoesNotOverlapAsync(null, request.HallId, request.StartTime, request.EndTime, cancellationToken);

        var showtime = new Showtime
        {
            ItemId = request.ItemId,
            HallId = request.HallId,
            ShowtimeStatusId = showtimeStatusId,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Price = request.Price
        };

        _dbContext.Showtimes.Add(showtime);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(showtime.Id, cancellationToken);
    }

    public async Task<ShowtimeDto> UpdateAsync(Guid id, UpdateShowtimeRequest request, CancellationToken cancellationToken)
    {
        var showtimeStatusId = await ValidateAndResolveShowtimeValuesAsync(
            request.ItemId,
            request.HallId,
            request.ShowtimeStatusId,
            cancellationToken);
        ValidateShowtimeRange(request.StartTime, request.EndTime, request.Price);
        await EnsureHallDoesNotOverlapAsync(id, request.HallId, request.StartTime, request.EndTime, cancellationToken);

        var showtime = await _dbContext.Showtimes
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new NotFoundException("Showtime was not found.");

        var hasBookings = await _dbContext.Bookings.AnyAsync(booking => booking.ShowtimeId == id, cancellationToken);
        if (hasBookings)
        {
            throw new ConflictException("Cannot update a showtime that already has bookings.");
        }

        showtime.ItemId = request.ItemId;
        showtime.HallId = request.HallId;
        showtime.ShowtimeStatusId = showtimeStatusId;
        showtime.StartTime = request.StartTime;
        showtime.EndTime = request.EndTime;
        showtime.Price = request.Price;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(showtime.Id, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var showtime = await _dbContext.Showtimes.SingleOrDefaultAsync(showtime => showtime.Id == id, cancellationToken)
            ?? throw new NotFoundException("Showtime was not found.");

        var hasBookings = await _dbContext.Bookings.AnyAsync(booking => booking.ShowtimeId == id, cancellationToken);
        if (hasBookings)
        {
            throw new ConflictException("Cannot delete a showtime that already has bookings.");
        }

        _dbContext.Showtimes.Remove(showtime);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<Showtime> ShowtimeDetailsQuery() =>
        _dbContext.Showtimes
            .AsNoTracking()
            .Include(showtime => showtime.Item).ThenInclude(item => item.ItemType)
            .Include(showtime => showtime.ShowtimeStatus)
            .Include(showtime => showtime.Hall).ThenInclude(hall => hall.Venue)
            .Include(showtime => showtime.Hall).ThenInclude(hall => hall.Seats).ThenInclude(seat => seat.SeatType)
            .Include(showtime => showtime.BookedSeats).ThenInclude(bookedSeat => bookedSeat.Booking);

    private async Task<Guid> ValidateAndResolveShowtimeValuesAsync(
        Guid itemId,
        Guid hallId,
        Guid? showtimeStatusId,
        CancellationToken cancellationToken)
    {
        if (itemId == Guid.Empty || hallId == Guid.Empty)
        {
            throw new ValidationException("Item and hall are required.");
        }

        var item = await _dbContext.Items
            .AsNoTracking()
            .Include(item => item.ItemType)
            .SingleOrDefaultAsync(item => item.Id == itemId, cancellationToken)
            ?? throw new NotFoundException("Item was not found.");

        var hall = await _dbContext.Halls
            .AsNoTracking()
            .Include(hall => hall.HallType)
            .Include(hall => hall.ItemType)
            .SingleOrDefaultAsync(hall => hall.Id == hallId, cancellationToken)
            ?? throw new NotFoundException("Hall was not found.");

        ValidateItemTypeMatchesHall(item, hall);
        ValidateItemSupportsHallType(item, hall);

        var resolvedStatusId = showtimeStatusId.GetValueOrDefault(ShowtimeStatusConfiguration.ScheduledId);
        var statusExists = await _dbContext.ShowtimeStatuses
            .AnyAsync(status => status.Id == resolvedStatusId, cancellationToken);
        if (!statusExists)
        {
            throw new NotFoundException("Showtime status was not found.");
        }

        return resolvedStatusId;
    }

    private static void ValidateItemTypeMatchesHall(Item item, Hall hall)
    {
        // Business rule: a hall is scheduled only for the item type it was configured to host.
        // This keeps the admin flow generic while preventing a concert/show/event from using CGV-only halls.
        if (item.ItemTypeId != hall.ItemTypeId)
        {
            throw new ValidationException($"Selected hall is configured for {hall.ItemType.Name}, not {item.ItemType.Name}.");
        }
    }

    private static void ValidateItemSupportsHallType(Item item, Hall hall)
    {
        var metadata = ItemMetadataSerializer.DeserializeKnownMetadata(item.ItemType.Slug, item.Metadata);
        if (metadata is not TicketBook.Domain.ValueObjects.CinemaItemMetadata cinemaMetadata)
        {
            return;
        }

        // Business rule: cinema items explicitly declare the hall formats they support.
        // Showtime stores HallId only, so the selected Hall's HallTypeId is the source of truth.
        if (cinemaMetadata.SupportedHallTypeIds is null || !cinemaMetadata.SupportedHallTypeIds.Contains(hall.HallTypeId))
        {
            throw new ValidationException($"Item does not support the selected hall format: {hall.HallType.Name}.");
        }
    }

    private static void ValidateShowtimeRange(DateTimeOffset startTime, DateTimeOffset endTime, decimal price)
    {
        if (startTime >= endTime)
        {
            throw new ValidationException("Showtime start time must be earlier than end time.");
        }

        if (price < 0)
        {
            throw new ValidationException("Showtime price cannot be negative.");
        }
    }

    private async Task EnsureHallDoesNotOverlapAsync(
        Guid? currentShowtimeId,
        Guid hallId,
        DateTimeOffset startTime,
        DateTimeOffset endTime,
        CancellationToken cancellationToken)
    {
        // Business rule: one physical hall cannot host two sellable sessions at the same time.
        // Conflict formula: NewStart < ExistingEnd && NewEnd > ExistingStart.
        var hasOverlap = await _dbContext.Showtimes
            .AsNoTracking()
            .AnyAsync(showtime =>
                showtime.HallId == hallId &&
                (!currentShowtimeId.HasValue || showtime.Id != currentShowtimeId.Value) &&
                startTime < showtime.EndTime &&
                endTime > showtime.StartTime,
                cancellationToken);

        if (hasOverlap)
        {
            throw new ConflictException("Hall already has another showtime in this time range.");
        }
    }

    private static (int Page, int PageSize) NormalizePaging(int page, int pageSize)
    {
        return (Math.Max(1, page), Math.Clamp(pageSize, 1, 100));
    }
}
