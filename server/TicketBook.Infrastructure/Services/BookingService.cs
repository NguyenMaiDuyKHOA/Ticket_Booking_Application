using System.Data;
using Microsoft.EntityFrameworkCore;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Bookings;
using TicketBook.Application.Interfaces;
using TicketBook.Domain.Entities;
using TicketBook.Domain.Enums;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

public sealed class BookingService : IBookingService
{
    private readonly ApplicationDbContext _dbContext;

    public BookingService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<BookingDto>> GetForUserAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken)
    {
        (page, pageSize) = NormalizePaging(page, pageSize);

        var query = _dbContext.Bookings
            .AsNoTracking()
            .Include(booking => booking.Showtime).ThenInclude(showtime => showtime.Movie)
            .Include(booking => booking.Showtime).ThenInclude(showtime => showtime.Cinema)
            .Include(booking => booking.Tickets).ThenInclude(ticket => ticket.Seat)
            .Where(booking => booking.UserId == userId);

        var totalCount = await query.CountAsync(cancellationToken);
        var bookings = await query
            .OrderByDescending(booking => booking.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        var items = bookings.Select(booking => booking.ToDto()).ToList();

        return new PagedResult<BookingDto>(items, page, pageSize, totalCount);
    }

    public async Task<BookingDto> GetByIdAsync(Guid id, Guid userId, bool isAdmin, CancellationToken cancellationToken)
    {
        var booking = await BookingDetailsQuery()
            .SingleOrDefaultAsync(booking => booking.Id == id, cancellationToken)
            ?? throw new NotFoundException("Booking was not found.");

        EnsureCanAccess(booking, userId, isAdmin);

        return booking.ToDto();
    }

    public async Task<BookingDto> CreateAsync(Guid userId, CreateBookingRequest request, CancellationToken cancellationToken)
    {
        if (request.SeatIds.Count == 0)
        {
            throw new ValidationException("At least one seat must be selected.");
        }

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);

        var showtime = await _dbContext.Showtimes
            .Include(candidate => candidate.Seats)
            .SingleOrDefaultAsync(candidate => candidate.Id == request.ShowtimeId, cancellationToken)
            ?? throw new NotFoundException("Showtime was not found.");

        if (showtime.StartTime <= DateTimeOffset.UtcNow)
        {
            throw new ConflictException("Cannot book a showtime that has already started.");
        }

        var requestedSeatIds = request.SeatIds.Distinct().ToList();
        if (requestedSeatIds.Count != request.SeatIds.Count)
        {
            throw new ValidationException("Selected seats must be unique.");
        }

        var seats = showtime.Seats
            .Where(seat => requestedSeatIds.Contains(seat.Id))
            .ToList();

        if (seats.Count != requestedSeatIds.Count)
        {
            throw new NotFoundException("One or more selected seats were not found for this showtime.");
        }

        if (seats.Any(seat => seat.IsBooked))
        {
            throw new ConflictException("One or more selected seats are already booked.");
        }

        var tickets = seats.Select(seat =>
        {
            var price = seat.SeatType == SeatType.Vip ? showtime.VipSeatPrice : showtime.StandardSeatPrice;
            seat.IsBooked = true;

            return new Ticket
            {
                SeatId = seat.Id,
                Price = price
            };
        }).ToList();

        var booking = new Booking
        {
            UserId = userId,
            ShowtimeId = showtime.Id,
            Status = BookingStatus.Confirmed,
            TotalPrice = tickets.Sum(ticket => ticket.Price),
            Tickets = tickets
        };

        _dbContext.Bookings.Add(booking);

        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            throw new ConflictException("One or more selected seats are no longer available.");
        }

        return await GetByIdAsync(booking.Id, userId, isAdmin: false, cancellationToken);
    }

    public async Task CancelAsync(Guid id, Guid userId, bool isAdmin, CancellationToken cancellationToken)
    {
        var booking = await _dbContext.Bookings
            .Include(candidate => candidate.Showtime)
            .Include(candidate => candidate.Tickets).ThenInclude(ticket => ticket.Seat)
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new NotFoundException("Booking was not found.");

        EnsureCanAccess(booking, userId, isAdmin);

        if (booking.Status == BookingStatus.Cancelled)
        {
            return;
        }

        if (booking.Showtime.StartTime <= DateTimeOffset.UtcNow)
        {
            throw new ConflictException("Cannot cancel a booking after the showtime has started.");
        }

        booking.Status = BookingStatus.Cancelled;
        foreach (var ticket in booking.Tickets)
        {
            ticket.Seat.IsBooked = false;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<Booking> BookingDetailsQuery() =>
        _dbContext.Bookings
            .AsNoTracking()
            .Include(booking => booking.Showtime).ThenInclude(showtime => showtime.Movie)
            .Include(booking => booking.Showtime).ThenInclude(showtime => showtime.Cinema)
            .Include(booking => booking.Tickets).ThenInclude(ticket => ticket.Seat);

    private static void EnsureCanAccess(Booking booking, Guid userId, bool isAdmin)
    {
        if (!isAdmin && booking.UserId != userId)
        {
            throw new NotFoundException("Booking was not found.");
        }
    }

    private static (int Page, int PageSize) NormalizePaging(int page, int pageSize)
    {
        return (Math.Max(1, page), Math.Clamp(pageSize, 1, 100));
    }
}
