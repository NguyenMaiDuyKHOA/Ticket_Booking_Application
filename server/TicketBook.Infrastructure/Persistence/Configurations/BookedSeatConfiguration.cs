using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class BookedSeatConfiguration : BaseEntityConfiguration<BookedSeat>
{
    public override void Configure(EntityTypeBuilder<BookedSeat> builder)
    {
        base.Configure(builder);
        builder.ToTable("BookedSeat");

        builder.HasOne(bookedSeat => bookedSeat.Showtime)
            .WithMany(showtime => showtime.BookedSeats)
            .HasForeignKey(bookedSeat => bookedSeat.ShowtimeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(bookedSeat => bookedSeat.Seat)
            .WithMany(seat => seat.BookedSeats)
            .HasForeignKey(bookedSeat => bookedSeat.SeatId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(bookedSeat => bookedSeat.Booking)
            .WithMany(booking => booking.BookedSeats)
            .HasForeignKey(bookedSeat => bookedSeat.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        // A seat can be actively booked only once per showtime. Soft-deleted rows keep history without blocking rebooking.
        builder.HasIndex(bookedSeat => new { bookedSeat.ShowtimeId, bookedSeat.SeatId })
            .IsUnique()
            .HasFilter("\"IsDeleted\" = FALSE");

        builder.HasIndex(bookedSeat => bookedSeat.BookingId);
    }
}
