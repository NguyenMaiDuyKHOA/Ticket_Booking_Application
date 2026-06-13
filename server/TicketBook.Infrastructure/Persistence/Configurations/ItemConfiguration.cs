using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class ItemConfiguration : BaseEntityConfiguration<Item>
{
    public override void Configure(EntityTypeBuilder<Item> builder)
    {
        base.Configure(builder);
        builder.ToTable("Item", table =>
        {
            table.HasCheckConstraint("CK_Item_Price_NonNegative", "\"Price\" >= 0");
            table.HasCheckConstraint("CK_Item_Metadata_IsJson", "jsonb_typeof(\"Metadata\") IS NOT NULL");
        });

        builder.Property(item => item.ItemTypeId).IsRequired();
        builder.Property(item => item.ItemStatusId).IsRequired();
        builder.Property(item => item.Title).HasMaxLength(250).IsRequired();
        builder.Property(item => item.Slug).HasMaxLength(280).IsRequired();
        builder.Property(item => item.Description).HasColumnType("text").IsRequired();
        builder.Property(item => item.StartDate).HasColumnType("date").IsRequired();
        builder.Property(item => item.Price).HasPrecision(12, 2).IsRequired();
        builder.Property(item => item.ImageUrl).HasMaxLength(1000);
        builder.Property(item => item.PosterUrl).HasMaxLength(1000);
        builder.Property(item => item.Metadata).HasColumnType("jsonb").IsRequired();

        builder.HasOne(item => item.ItemType)
            .WithMany(itemType => itemType.Items)
            .HasForeignKey(item => item.ItemTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(item => item.ItemStatus)
            .WithMany(itemStatus => itemStatus.Items)
            .HasForeignKey(item => item.ItemStatusId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(item => item.ItemGenres)
            .WithOne(itemGenre => itemGenre.Item)
            .HasForeignKey(itemGenre => itemGenre.ItemId);

        builder.HasIndex(item => item.Slug).IsUnique();
        builder.HasIndex(item => new { item.ItemTypeId, item.ItemStatusId });
        builder.HasIndex(item => item.Price);
        builder.HasIndex(item => item.StartDate);
        builder.HasIndex(item => item.Title);
    }
}
