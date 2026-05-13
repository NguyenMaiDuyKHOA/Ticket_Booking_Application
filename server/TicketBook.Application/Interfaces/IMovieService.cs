using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Movies;

namespace TicketBook.Application.Interfaces;

public interface IMovieService
{
    Task<PagedResult<MovieDto>> GetPagedAsync(int page, int pageSize, string? search, CancellationToken cancellationToken);
    Task<MovieDto> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<MovieDto> CreateAsync(CreateMovieRequest request, CancellationToken cancellationToken);
    Task<MovieDto> UpdateAsync(Guid id, UpdateMovieRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
