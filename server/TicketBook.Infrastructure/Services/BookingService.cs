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
            .Include(booking => booking.Showtime).ThenInclude(showtime => showtime.Item)
            .Include(booking => booking.Showtime).ThenInclude(showtime => showtime.Hall).ThenInclude(hall => hall.Venue)
            .Include(booking => booking.Tickets).ThenInclude(ticket => ticket.Seat).ThenInclude(seat => seat.SeatType)
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
            .Include(candidate => candidate.Item)
            .Include(candidate => candidate.Hall).ThenInclude(hall => hall!.Venue)
            .Include(candidate => candidate.Hall).ThenInclude(hall => hall!.Seats).ThenInclude(seat => seat.SeatType)
            .Include(candidate => candidate.BookedSeats).ThenInclude(bookedSeat => bookedSeat.Booking)
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

        var hallSeats = showtime.Hall?.Seats ?? new List<Seat>();
        var seats = hallSeats
            .Where(seat => requestedSeatIds.Contains(seat.Id))
            .ToList();

        if (seats.Count != requestedSeatIds.Count)
        {
            throw new NotFoundException("One or more selected seats were not found for this showtime.");
        }

        var bookedSeatIds = showtime.BookedSeats
            .Where(bookedSeat => bookedSeat.Booking.Status != BookingStatus.Cancelled)
            .Select(bookedSeat => bookedSeat.SeatId)
            .ToHashSet();

        if (seats.Any(seat => bookedSeatIds.Contains(seat.Id)))
        {
            throw new ConflictException("One or more selected seats are already booked.");
        }

        if (bookedSeatIds.Count + seats.Count > hallSeats.Count)
        {
            throw new ConflictException("Not enough tickets are available for this showtime.");
        }

        var tickets = seats.Select(seat =>
        {
            return new Ticket
            {
                SeatId = seat.Id,
                // Tickets snapshot the showtime price at booking time so later schedule price changes do not rewrite history.
                Price = showtime.Price
            };
        }).ToList();

        var bookedSeats = seats.Select(seat => new BookedSeat
        {
            ShowtimeId = showtime.Id,
            SeatId = seat.Id
        }).ToList();

        var booking = new Booking
        {
            UserId = userId,
            ShowtimeId = showtime.Id,
            BookingNumber = CreateBookingNumber(),
            Status = BookingStatus.Confirmed,
            SubtotalPrice = tickets.Sum(ticket => ticket.Price),
            TotalPrice = tickets.Sum(ticket => ticket.Price),
            Tickets = tickets,
            BookedSeats = bookedSeats
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
            .Include(candidate => candidate.BookedSeats)
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
        _dbContext.BookedSeats.RemoveRange(booking.BookedSeats);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<Booking> BookingDetailsQuery() =>
        _dbContext.Bookings
            .AsNoTracking()
            .Include(booking => booking.Showtime).ThenInclude(showtime => showtime.Item)
            .Include(booking => booking.Showtime).ThenInclude(showtime => showtime.Hall).ThenInclude(hall => hall.Venue)
            .Include(booking => booking.Tickets).ThenInclude(ticket => ticket.Seat).ThenInclude(seat => seat.SeatType);

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

    private static string CreateBookingNumber()
    {
        // The booking number is user-facing; keep it short while preserving enough entropy for uniqueness.
        return $"TB{DateTimeOffset.UtcNow:yyyyMMddHHmmss}{Guid.NewGuid():N}"[..32].ToUpperInvariant();
    }
}
