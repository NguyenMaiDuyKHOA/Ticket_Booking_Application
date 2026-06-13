using TicketBook.Application.DTOs.ShowtimeStatuses;

namespace TicketBook.Application.Interfaces;

public interface IShowtimeStatusService
{
    Task<IReadOnlyList<ShowtimeStatusDto>> GetAllAsync(CancellationToken cancellationToken);
}
