using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Cinemas;

namespace TicketBook.Application.Interfaces;

public interface ICinemaService
{
    Task<PagedResult<CinemaDto>> GetPagedAsync(int page, int pageSize, string? city, CancellationToken cancellationToken);
    Task<CinemaDto> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<CinemaDto> CreateAsync(CreateCinemaRequest request, CancellationToken cancellationToken);
    Task<CinemaDto> UpdateAsync(Guid id, UpdateCinemaRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
