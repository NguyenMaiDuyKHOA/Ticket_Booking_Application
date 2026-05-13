using Microsoft.EntityFrameworkCore;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Showtimes;
using TicketBook.Application.Interfaces;
using TicketBook.Domain.Entities;
using TicketBook.Domain.Enums;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class ShowtimeService : IShowtimeService
{
    private readonly ApplicationDbContext _dbContext;

    public ShowtimeService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<ShowtimeDto>> GetPagedAsync(Guid? movieId, Guid? cinemaId, DateOnly? date, int page, int pageSize, CancellationToken cancellationToken)
    {
        (page, pageSize) = NormalizePaging(page, pageSize);

        var query = _dbContext.Showtimes
            .AsNoTracking()
            .Include(showtime => showtime.Movie)
            .Include(showtime => showtime.Cinema)
            .Include(showtime => showtime.Seats)
            .AsQueryable();

        if (movieId.HasValue)
        {
            query = query.Where(showtime => showtime.MovieId == movieId.Value);
        }

        if (cinemaId.HasValue)
        {
            query = query.Where(showtime => showtime.CinemaId == cinemaId.Value);
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
        var showtime = await _dbContext.Showtimes
            .AsNoTracking()
            .Include(candidate => candidate.Movie)
            .Include(candidate => candidate.Cinema)
            .Include(candidate => candidate.Seats)
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken);

        return showtime?.ToDto() ?? throw new NotFoundException("Showtime was not found.");
    }

    public async Task<ShowtimeDto> CreateAsync(CreateShowtimeRequest request, CancellationToken cancellationToken)
    {
        ValidateCreateRequest(request);

        var movie = await _dbContext.Movies.SingleOrDefaultAsync(movie => movie.Id == request.MovieId, cancellationToken)
            ?? throw new NotFoundException("Movie was not found.");

        var cinemaExists = await _dbContext.Cinemas.AnyAsync(cinema => cinema.Id == request.CinemaId, cancellationToken);
        if (!cinemaExists)
        {
            throw new NotFoundException("Cinema was not found.");
        }

        var showtime = new Showtime
        {
            MovieId = request.MovieId,
            CinemaId = request.CinemaId,
            StartTime = request.StartTime,
            EndTime = request.StartTime.AddMinutes(movie.Duration),
            RoomNumber = request.RoomNumber.Trim(),
            StandardSeatPrice = request.StandardSeatPrice,
            VipSeatPrice = request.VipSeatPrice,
            Seats = GenerateSeats(request.SeatCount, request.VipSeatCount)
        };

        _dbContext.Showtimes.Add(showtime);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(showtime.Id, cancellationToken);
    }

    public async Task<ShowtimeDto> UpdateAsync(Guid id, UpdateShowtimeRequest request, CancellationToken cancellationToken)
    {
        ValidateUpdateRequest(request);

        var showtime = await _dbContext.Showtimes
            .Include(candidate => candidate.Movie)
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new NotFoundException("Showtime was not found.");

        var hasBookings = await _dbContext.Bookings.AnyAsync(booking => booking.ShowtimeId == id, cancellationToken);
        if (hasBookings)
        {
            throw new ConflictException("Cannot update a showtime that already has bookings.");
        }

        showtime.StartTime = request.StartTime;
        showtime.EndTime = request.StartTime.AddMinutes(showtime.Movie.Duration);
        showtime.RoomNumber = request.RoomNumber.Trim();
        showtime.StandardSeatPrice = request.StandardSeatPrice;
        showtime.VipSeatPrice = request.VipSeatPrice;

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

    private static List<Seat> GenerateSeats(int seatCount, int vipSeatCount)
    {
        var seats = new List<Seat>(seatCount);

        for (var index = 1; index <= seatCount; index++)
        {
            var row = (char)('A' + ((index - 1) / 10));
            var number = ((index - 1) % 10) + 1;

            seats.Add(new Seat
            {
                SeatNumber = $"{row}{number}",
                SeatType = index > seatCount - vipSeatCount ? SeatType.Vip : SeatType.Standard
            });
        }

        return seats;
    }

    private static void ValidateCreateRequest(CreateShowtimeRequest request)
    {
        ValidatePricesAndRoom(request.RoomNumber, request.StandardSeatPrice, request.VipSeatPrice);

        if (request.SeatCount <= 0)
        {
            throw new ValidationException("Seat count must be greater than zero.");
        }

        if (request.VipSeatCount < 0 || request.VipSeatCount > request.SeatCount)
        {
            throw new ValidationException("VIP seat count must be between zero and total seat count.");
        }
    }

    private static void ValidateUpdateRequest(UpdateShowtimeRequest request)
    {
        ValidatePricesAndRoom(request.RoomNumber, request.StandardSeatPrice, request.VipSeatPrice);
    }

    private static void ValidatePricesAndRoom(string roomNumber, decimal standardSeatPrice, decimal vipSeatPrice)
    {
        if (string.IsNullOrWhiteSpace(roomNumber))
        {
            throw new ValidationException("Room number is required.");
        }

        if (standardSeatPrice <= 0 || vipSeatPrice <= 0)
        {
            throw new ValidationException("Seat prices must be greater than zero.");
        }

        if (vipSeatPrice < standardSeatPrice)
        {
            throw new ValidationException("VIP seat price must be greater than or equal to standard seat price.");
        }
    }

    private static (int Page, int PageSize) NormalizePaging(int page, int pageSize)
    {
        return (Math.Max(1, page), Math.Clamp(pageSize, 1, 100));
    }
}
