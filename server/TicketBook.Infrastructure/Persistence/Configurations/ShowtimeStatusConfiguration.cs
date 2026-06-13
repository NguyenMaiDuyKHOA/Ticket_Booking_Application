using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class ShowtimeStatusConfiguration : BaseEntityConfiguration<ShowtimeStatus>
{
    public static readonly Guid ScheduledId = Guid.Parse("44444444-4444-4444-4444-444444444441");
    public static readonly Guid CancelledId = Guid.Parse("44444444-4444-4444-4444-444444444442");
    public static readonly Guid SoldOutId = Guid.Parse("44444444-4444-4444-4444-444444444443");
    public static readonly Guid CompletedId = Guid.Parse("44444444-4444-4444-4444-444444444444");

    private static readonly DateTimeOffset SeedCreatedAt = new(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);

    public override void Configure(EntityTypeBuilder<ShowtimeStatus> builder)
    {
        base.Configure(builder);
        builder.ToTable("ShowtimeStatus");

        builder.Property(showtimeStatus => showtimeStatus.Name).HasMaxLength(80).IsRequired();
        builder.Property(showtimeStatus => showtimeStatus.Slug).HasMaxLength(80).IsRequired();
        builder.Property(showtimeStatus => showtimeStatus.Description).HasMaxLength(500);

        // Slug is the stable business key used by scheduling workflows and future admin filters.
        builder.HasIndex(showtimeStatus => showtimeStatus.Slug).IsUnique();
        builder.HasIndex(showtimeStatus => showtimeStatus.Name).IsUnique();

        builder.HasData(
            new ShowtimeStatus
            {
                Id = ScheduledId,
                Name = "Scheduled",
                Slug = "scheduled",
                Description = "Showtime is available for booking.",
                CreatedAt = SeedCreatedAt
            },
            new ShowtimeStatus
            {
                Id = CancelledId,
                Name = "Cancelled",
                Slug = "cancelled",
                Description = "Showtime has been cancelled and should not accept bookings.",
                CreatedAt = SeedCreatedAt
            },
            new ShowtimeStatus
            {
                Id = SoldOutId,
                Name = "Sold Out",
                Slug = "sold-out",
                Description = "Showtime has no available seats left.",
                CreatedAt = SeedCreatedAt
            },
            new ShowtimeStatus
            {
                Id = CompletedId,
                Name = "Completed",
                Slug = "completed",
                Description = "Showtime has already ended.",
                CreatedAt = SeedCreatedAt
            });
    }
}
