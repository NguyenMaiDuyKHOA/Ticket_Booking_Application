namespace TicketBook.Domain.Common;

/// <summary>
/// Provides shared identity, audit metadata, and soft-delete state for aggregate roots and entities.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public bool IsDeleted { get; set; }
}
