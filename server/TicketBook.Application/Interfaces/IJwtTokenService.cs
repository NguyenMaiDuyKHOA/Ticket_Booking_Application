using TicketBook.Application.DTOs.Auth;
using TicketBook.Domain.Entities;

namespace TicketBook.Application.Interfaces;

public interface IJwtTokenService
{
    AuthResponse CreateToken(User user);
}
