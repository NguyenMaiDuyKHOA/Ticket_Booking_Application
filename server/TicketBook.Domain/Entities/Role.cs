using TicketBook.Domain.Common;

namespace TicketBook.Domain.Entities;

/// <summary>
/// Defines authorization roles independently from users so permissions can evolve without changing user rows.
/// </summary>
public sealed class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;

    public ICollection<UserRoleAssignment> UserRoles { get; set; } = new List<UserRoleAssignment>();
}
