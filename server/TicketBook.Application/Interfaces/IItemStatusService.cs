using TicketBook.Application.DTOs.ItemStatuses;

namespace TicketBook.Application.Interfaces;

public interface IItemStatusService
{
    Task<IReadOnlyList<ItemStatusDto>> GetAllAsync(CancellationToken cancellationToken);
}
