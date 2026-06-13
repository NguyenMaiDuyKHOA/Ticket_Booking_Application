using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class TicketConfiguration : BaseEntityConfiguration<Ticket>
{
    public override void Configure(EntityTypeBuilder<Ticket> builder)
    {
        base.Configure(builder);
        builder.ToTable("Ticket");

        builder.Property(ticket => ticket.Price).HasPrecision(12, 2).IsRequired();

        builder.HasOne(ticket => ticket.Booking)
            .WithMany(booking => booking.Tickets)
            .HasForeignKey(ticket => ticket.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ticket => ticket.Seat)
            .WithMany(seat => seat.Tickets)
            .HasForeignKey(ticket => ticket.SeatId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(ticket => ticket.SeatId);
    }
}
