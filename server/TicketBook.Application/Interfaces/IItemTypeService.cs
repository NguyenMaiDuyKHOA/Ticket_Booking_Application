using TicketBook.Application.DTOs.ItemTypes;

namespace TicketBook.Application.Interfaces;

public interface IItemTypeService
{
    Task<IReadOnlyList<ItemTypeDto>> GetAllAsync(CancellationToken cancellationToken);
}
