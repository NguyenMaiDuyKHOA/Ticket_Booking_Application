namespace TicketBook.Application.DTOs.ItemTypes;

public sealed record ItemTypeDto(Guid Id, string Name, string Slug, string? Description);
