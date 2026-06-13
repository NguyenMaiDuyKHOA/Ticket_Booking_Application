using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class SeatConfiguration : BaseEntityConfiguration<Seat>
{
    public override void Configure(EntityTypeBuilder<Seat> builder)
    {
        base.Configure(builder);
        builder.ToTable("Seat");

        builder.Property(seat => seat.Row).HasMaxLength(10).IsRequired();
        builder.Property(seat => seat.Number).IsRequired();

        builder.HasOne(seat => seat.Hall)
            .WithMany(hall => hall.Seats)
            .HasForeignKey(seat => seat.HallId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(seat => seat.SeatType)
            .WithMany(seatType => seatType.Seats)
            .HasForeignKey(seat => seat.SeatTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(seat => new { seat.HallId, seat.Row, seat.Number }).IsUnique();
        builder.HasIndex(seat => new { seat.HallId, seat.SeatTypeId });
    }
}
