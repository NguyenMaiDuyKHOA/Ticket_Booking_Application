using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Bookings;

namespace TicketBook.Application.Interfaces;

public interface IBookingService
{
    Task<PagedResult<BookingDto>> GetForUserAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken);
    Task<BookingDto> GetByIdAsync(Guid id, Guid userId, bool isAdmin, CancellationToken cancellationToken);
    Task<BookingDto> CreateAsync(Guid userId, CreateBookingRequest request, CancellationToken cancellationToken);
    Task CancelAsync(Guid id, Guid userId, bool isAdmin, CancellationToken cancellationToken);
}
