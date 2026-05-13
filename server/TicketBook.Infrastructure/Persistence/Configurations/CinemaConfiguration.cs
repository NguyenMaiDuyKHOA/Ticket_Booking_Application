using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class CinemaConfiguration : IEntityTypeConfiguration<Cinema>
{
    public void Configure(EntityTypeBuilder<Cinema> builder)
    {
        builder.ToTable("Cinema");
        builder.HasKey(cinema => cinema.Id);

        builder.Property(cinema => cinema.Name).HasMaxLength(200).IsRequired();
        builder.Property(cinema => cinema.Address).HasMaxLength(500).IsRequired();
        builder.Property(cinema => cinema.City).HasMaxLength(120).IsRequired();

        builder.HasIndex(cinema => cinema.City);
    }
}
