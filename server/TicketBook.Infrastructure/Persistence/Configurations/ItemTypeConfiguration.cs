using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class ItemTypeConfiguration : BaseEntityConfiguration<ItemType>
{
    public override void Configure(EntityTypeBuilder<ItemType> builder)
    {
        base.Configure(builder);
        builder.ToTable("ItemType");

        builder.Property(itemType => itemType.Name).HasMaxLength(120).IsRequired();
        builder.Property(itemType => itemType.Slug).HasMaxLength(140).IsRequired();
        builder.Property(itemType => itemType.Description).HasMaxLength(500);

        builder.HasIndex(itemType => itemType.Slug).IsUnique();
    }
}
