namespace TicketBook.Application.DTOs.Auth;

public sealed record RegisterRequest(string FullName, string Phone, string Password);

public sealed record LoginRequest(string Phone, string Password);

public sealed record AuthResponse(
    Guid UserId,
    string FullName,
    string Phone,
    string Role,
    string AccessToken,
    DateTimeOffset ExpiresAt);
