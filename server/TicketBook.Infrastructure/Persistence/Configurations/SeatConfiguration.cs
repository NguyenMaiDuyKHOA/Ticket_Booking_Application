using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class SeatConfiguration : IEntityTypeConfiguration<Seat>
{
    public void Configure(EntityTypeBuilder<Seat> builder)
    {
        builder.ToTable("Seat");
        builder.HasKey(seat => seat.Id);

        builder.Property(seat => seat.SeatNumber).HasMaxLength(20).IsRequired();
        builder.Property(seat => seat.SeatType).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(seat => seat.IsBooked).IsRequired();

        builder.HasOne(seat => seat.Showtime)
            .WithMany(showtime => showtime.Seats)
            .HasForeignKey(seat => seat.ShowtimeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(seat => new { seat.ShowtimeId, seat.SeatNumber }).IsUnique();
        builder.HasIndex(seat => new { seat.ShowtimeId, seat.IsBooked });
    }
}
