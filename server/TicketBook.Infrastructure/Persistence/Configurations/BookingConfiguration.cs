using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class BookingConfiguration : BaseEntityConfiguration<Booking>
{
    public override void Configure(EntityTypeBuilder<Booking> builder)
    {
        base.Configure(builder);
        builder.ToTable("Booking", table =>
        {
            table.HasCheckConstraint("CK_Booking_TotalPrice_NonNegative", "\"TotalPrice\" >= 0");
            table.HasCheckConstraint("CK_Booking_DiscountAmount_NonNegative", "\"DiscountAmount\" >= 0");
        });

        builder.Property(booking => booking.BookingNumber).HasMaxLength(40).IsRequired();
        builder.Property(booking => booking.SubtotalPrice).HasPrecision(12, 2).IsRequired();
        builder.Property(booking => booking.DiscountAmount).HasPrecision(12, 2).IsRequired();
        builder.Property(booking => booking.TotalPrice).HasPrecision(12, 2).IsRequired();
        builder.Property(booking => booking.Status).HasConversion<string>().HasMaxLength(30).IsRequired();

        builder.HasOne(booking => booking.User)
            .WithMany(user => user.Bookings)
            .HasForeignKey(booking => booking.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(booking => booking.Showtime)
            .WithMany(showtime => showtime.Bookings)
            .HasForeignKey(booking => booking.ShowtimeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(booking => booking.Promotion)
            .WithMany(promotion => promotion.Bookings)
            .HasForeignKey(booking => booking.PromotionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(booking => booking.BookingNumber).IsUnique();
        builder.HasIndex(booking => new { booking.UserId, booking.CreatedAt });
        builder.HasIndex(booking => new { booking.ShowtimeId, booking.Status });
        builder.HasIndex(booking => booking.Status);
    }
}
