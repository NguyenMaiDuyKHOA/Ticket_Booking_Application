using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class VenueConfiguration : BaseEntityConfiguration<Venue>
{
    public override void Configure(EntityTypeBuilder<Venue> builder)
    {
        base.Configure(builder);
        builder.ToTable("Venue");

        builder.Property(venue => venue.CityId).IsRequired();
        builder.Property(venue => venue.Name).HasMaxLength(200).IsRequired();
        builder.Property(venue => venue.Address).HasMaxLength(500).IsRequired();

        builder.HasOne(venue => venue.City)
            .WithMany(city => city.Venues)
            .HasForeignKey(venue => venue.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(venue => venue.CityId);
        builder.HasIndex(venue => new { venue.Name, venue.CityId });
    }
}
