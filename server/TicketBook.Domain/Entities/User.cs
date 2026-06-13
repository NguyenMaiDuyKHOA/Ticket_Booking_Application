using TicketBook.Domain.Common;
using TicketBook.Domain.Enums;

namespace TicketBook.Domain.Entities;

public sealed class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<UserRoleAssignment> UserRoles { get; set; } = new List<UserRoleAssignment>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
