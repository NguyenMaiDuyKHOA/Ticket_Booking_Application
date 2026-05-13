using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.ToTable("Ticket");
        builder.HasKey(ticket => ticket.Id);

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
