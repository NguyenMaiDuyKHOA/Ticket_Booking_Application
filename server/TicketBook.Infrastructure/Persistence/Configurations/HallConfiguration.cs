using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class HallConfiguration : BaseEntityConfiguration<Hall>
{
    public override void Configure(EntityTypeBuilder<Hall> builder)
    {
        base.Configure(builder);
        builder.ToTable("Hall", table =>
        {
            table.HasCheckConstraint("CK_Hall_Capacity_Positive", "\"Capacity\" > 0");
        });

        builder.Property(hall => hall.Name).HasMaxLength(120).IsRequired();
        builder.Property(hall => hall.Capacity).IsRequired();
        builder.Property(hall => hall.ItemTypeId).IsRequired();

        builder.HasOne(hall => hall.Venue)
            .WithMany(venue => venue.Halls)
            .HasForeignKey(hall => hall.VenueId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(hall => hall.HallType)
            .WithMany(hallType => hallType.Halls)
            .HasForeignKey(hall => hall.HallTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(hall => hall.ItemType)
            .WithMany(itemType => itemType.Halls)
            .HasForeignKey(hall => hall.ItemTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(hall => new { hall.VenueId, hall.Name }).IsUnique();
        builder.HasIndex(hall => hall.ItemTypeId);
        builder.HasIndex(hall => new { hall.VenueId, hall.HallTypeId });
        builder.HasIndex(hall => new { hall.ItemTypeId, hall.VenueId });
    }
}
