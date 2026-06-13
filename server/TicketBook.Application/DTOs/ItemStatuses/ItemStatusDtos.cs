namespace TicketBook.Application.DTOs.ItemStatuses;

public sealed record ItemStatusDto(Guid Id, string Name, string Slug, string? Description);
