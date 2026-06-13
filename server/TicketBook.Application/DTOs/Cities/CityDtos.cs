namespace TicketBook.Application.DTOs.Cities;

/// <summary>
/// Read model used by clients to render city selection options.
/// </summary>
public sealed record CityDto(Guid Id, string Name, string Slug);
