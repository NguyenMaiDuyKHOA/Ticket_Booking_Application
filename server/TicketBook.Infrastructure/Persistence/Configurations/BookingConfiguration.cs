using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("Booking");
        builder.HasKey(booking => booking.Id);

        builder.Property(booking => booking.TotalPrice).HasPrecision(12, 2).IsRequired();
        builder.Property(booking => booking.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(booking => booking.CreatedAt).IsRequired();

        builder.HasOne(booking => booking.User)
            .WithMany(user => user.Bookings)
            .HasForeignKey(booking => booking.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(booking => booking.Showtime)
            .WithMany(showtime => showtime.Bookings)
            .HasForeignKey(booking => booking.ShowtimeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(booking => new { booking.UserId, booking.CreatedAt });
        builder.HasIndex(booking => booking.Status);
    }
}
