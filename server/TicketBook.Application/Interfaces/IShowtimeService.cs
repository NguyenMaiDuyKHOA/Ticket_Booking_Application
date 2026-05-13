using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Showtimes;

namespace TicketBook.Application.Interfaces;

public interface IShowtimeService
{
    Task<PagedResult<ShowtimeDto>> GetPagedAsync(Guid? movieId, Guid? cinemaId, DateOnly? date, int page, int pageSize, CancellationToken cancellationToken);
    Task<ShowtimeDto> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ShowtimeDto> CreateAsync(CreateShowtimeRequest request, CancellationToken cancellationToken);
    Task<ShowtimeDto> UpdateAsync(Guid id, UpdateShowtimeRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
