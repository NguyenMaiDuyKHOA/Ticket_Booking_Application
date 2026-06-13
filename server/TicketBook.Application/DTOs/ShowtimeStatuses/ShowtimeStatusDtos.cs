namespace TicketBook.Application.DTOs.ShowtimeStatuses;

public sealed record ShowtimeStatusDto(Guid Id, string Name, string Slug, string? Description);
