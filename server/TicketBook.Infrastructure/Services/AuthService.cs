using Microsoft.EntityFrameworkCore;
using TicketBook.Application.Common;
using TicketBook.Application.DTOs.Auth;
using TicketBook.Application.Interfaces;
using TicketBook.Domain.Entities;
using TicketBook.Domain.Enums;
using TicketBook.Infrastructure.Persistence;

namespace TicketBook.Infrastructure.Services;

internal sealed class AuthService : IAuthService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(ApplicationDbContext dbContext, IPasswordHasher passwordHasher, IJwtTokenService jwtTokenService)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        ValidateRegister(request);

        var phone = NormalizePhone(request.Phone);
        var phoneExists = await _dbContext.Users.AnyAsync(user => user.Phone == phone, cancellationToken);
        if (phoneExists)
        {
            throw new ConflictException("Phone number is already registered.");
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Phone = phone,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = UserRole.User
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return _jwtTokenService.CreateToken(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var phone = NormalizePhone(request.Phone);
        var user = await _dbContext.Users.SingleOrDefaultAsync(candidate => candidate.Phone == phone, cancellationToken);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Invalid phone number or password.");
        }

        return _jwtTokenService.CreateToken(user);
    }

    private static void ValidateRegister(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            throw new ValidationException("Full name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Phone))
        {
            throw new ValidationException("Phone number is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
        {
            throw new ValidationException("Password must be at least 8 characters.");
        }
    }

    private static string NormalizePhone(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
        {
            throw new ValidationException("Phone number is required.");
        }

        var normalizedPhone = phone.Trim().Replace(" ", string.Empty).Replace("-", string.Empty);
        if (normalizedPhone.Length < 9 || normalizedPhone.Length > 15 || normalizedPhone.Any(character => !char.IsDigit(character) && character != '+'))
        {
            throw new ValidationException("Phone number is invalid.");
        }

        return normalizedPhone;
    }
}
