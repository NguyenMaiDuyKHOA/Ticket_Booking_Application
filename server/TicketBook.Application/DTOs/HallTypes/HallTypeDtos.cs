namespace TicketBook.Application.DTOs.HallTypes;

/// <summary>
/// Lookup model for hall formats that an Item can support when scheduling showtimes.
/// </summary>
public sealed record HallTypeDto(Guid Id, string Name, string Slug);
