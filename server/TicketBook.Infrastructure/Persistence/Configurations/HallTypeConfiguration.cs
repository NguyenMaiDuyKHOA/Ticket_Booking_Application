using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class HallTypeConfiguration : BaseEntityConfiguration<HallType>
{
    public override void Configure(EntityTypeBuilder<HallType> builder)
    {
        base.Configure(builder);
        builder.ToTable("HallType");

        builder.Property(hallType => hallType.Name).HasMaxLength(80).IsRequired();
        builder.Property(hallType => hallType.Slug).HasMaxLength(80).IsRequired();

        // Slug is the stable business key used by seed data and future admin tooling.
        builder.HasIndex(hallType => hallType.Slug).IsUnique();
    }
}
