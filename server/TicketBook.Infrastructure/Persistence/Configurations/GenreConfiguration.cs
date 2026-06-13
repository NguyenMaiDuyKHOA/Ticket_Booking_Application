using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class GenreConfiguration : BaseEntityConfiguration<Genre>
{
    public override void Configure(EntityTypeBuilder<Genre> builder)
    {
        base.Configure(builder);
        builder.ToTable("Genre");

        builder.Property(genre => genre.ItemTypeId).IsRequired();
        builder.Property(genre => genre.Name).HasMaxLength(120).IsRequired();
        builder.Property(genre => genre.Slug).HasMaxLength(140).IsRequired();
        builder.Property(genre => genre.Description).HasMaxLength(500);

        builder.HasOne(genre => genre.ItemType)
            .WithMany(itemType => itemType.Genres)
            .HasForeignKey(genre => genre.ItemTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(genre => new { genre.ItemTypeId, genre.Slug }).IsUnique();
        builder.HasIndex(genre => genre.Name);
    }
}
