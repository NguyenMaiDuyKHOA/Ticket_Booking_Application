namespace TicketBook.Domain.Entities;

/// <summary>
/// Join entity that allows a user to have multiple roles.
/// </summary>
public sealed class UserRoleAssignment
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }

    public User User { get; set; } = null!;
    public Role Role { get; set; } = null!;
}
