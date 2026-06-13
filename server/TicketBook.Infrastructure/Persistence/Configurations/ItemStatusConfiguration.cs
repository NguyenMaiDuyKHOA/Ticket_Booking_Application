using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class ItemStatusConfiguration : BaseEntityConfiguration<ItemStatus>
{
    public override void Configure(EntityTypeBuilder<ItemStatus> builder)
    {
        base.Configure(builder);
        builder.ToTable("ItemStatus");

        builder.Property(itemStatus => itemStatus.Name).HasMaxLength(80).IsRequired();
        builder.Property(itemStatus => itemStatus.Slug).HasMaxLength(80).IsRequired();
        builder.Property(itemStatus => itemStatus.Description).HasMaxLength(500);

        builder.HasIndex(itemStatus => itemStatus.Name).IsUnique();
        builder.HasIndex(itemStatus => itemStatus.Slug).IsUnique();
    }
}
