using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class ShowtimeConfiguration : BaseEntityConfiguration<Showtime>
{
    public override void Configure(EntityTypeBuilder<Showtime> builder)
    {
        base.Configure(builder);
        builder.ToTable("Showtime", table =>
        {
            table.HasCheckConstraint("CK_Showtime_Price_NonNegative", "\"Price\" >= 0");
            table.HasCheckConstraint("CK_Showtime_TimeRange_Valid", "\"StartTime\" < \"EndTime\"");
        });

        builder.Property(showtime => showtime.ShowtimeStatusId).IsRequired();
        builder.Property(showtime => showtime.StartTime).IsRequired();
        builder.Property(showtime => showtime.EndTime).IsRequired();
        builder.Property(showtime => showtime.Price).HasPrecision(12, 2).IsRequired();

        builder.HasOne(showtime => showtime.Item)
            .WithMany(item => item.Showtimes)
            .HasForeignKey(showtime => showtime.ItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(showtime => showtime.Hall)
            .WithMany(hall => hall.Showtimes)
            .HasForeignKey(showtime => showtime.HallId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(showtime => showtime.ShowtimeStatus)
            .WithMany(showtimeStatus => showtimeStatus.Showtimes)
            .HasForeignKey(showtime => showtime.ShowtimeStatusId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(showtime => new { showtime.ItemId, showtime.StartTime });
        // Overlap validation queries by HallId and time range. VenueId is intentionally not duplicated here
        // because Hall already owns the Venue relationship.
        builder.HasIndex(showtime => new { showtime.HallId, showtime.StartTime, showtime.EndTime });
        builder.HasIndex(showtime => showtime.ShowtimeStatusId);
        builder.HasIndex(showtime => showtime.StartTime);
    }
}
