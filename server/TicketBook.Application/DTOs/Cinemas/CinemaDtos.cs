namespace TicketBook.Application.DTOs.Cinemas;

public sealed record CinemaDto(Guid Id, string Name, string Address, string City);

public sealed record CreateCinemaRequest(string Name, string Address, string City);

public sealed record UpdateCinemaRequest(string Name, string Address, string City);
