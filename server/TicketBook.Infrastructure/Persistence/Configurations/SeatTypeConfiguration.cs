using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class SeatTypeConfiguration : BaseEntityConfiguration<SeatType>
{
    public override void Configure(EntityTypeBuilder<SeatType> builder)
    {
        base.Configure(builder);
        builder.ToTable("SeatType");

        builder.Property(seatType => seatType.Name).HasMaxLength(80).IsRequired();
        builder.Property(seatType => seatType.Slug).HasMaxLength(80).IsRequired();

        // Slug lets pricing rules reference a stable identifier without coupling to database IDs.
        builder.HasIndex(seatType => seatType.Slug).IsUnique();
    }
}
