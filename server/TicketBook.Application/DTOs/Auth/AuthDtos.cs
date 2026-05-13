using TicketBook.Domain.Enums;

namespace TicketBook.Application.DTOs.Auth;

public sealed record RegisterRequest(string FullName, string Email, string Password);

public sealed record LoginRequest(string Email, string Password);

public sealed record AuthResponse(
    Guid UserId,
    string FullName,
    string Email,
    UserRole Role,
    string AccessToken,
    DateTimeOffset ExpiresAt);
