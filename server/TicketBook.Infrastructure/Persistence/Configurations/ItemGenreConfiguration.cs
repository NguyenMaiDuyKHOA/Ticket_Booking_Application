using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class ItemGenreConfiguration : IEntityTypeConfiguration<ItemGenre>
{
    public void Configure(EntityTypeBuilder<ItemGenre> builder)
    {
        builder.ToTable("ItemGenre");

        builder.HasKey(itemGenre => new { itemGenre.ItemId, itemGenre.GenreId });

        builder.HasQueryFilter(itemGenre => !itemGenre.Item.IsDeleted && !itemGenre.Genre.IsDeleted);

        builder.HasOne(itemGenre => itemGenre.Item)
            .WithMany(item => item.ItemGenres)
            .HasForeignKey(itemGenre => itemGenre.ItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(itemGenre => itemGenre.Genre)
            .WithMany(genre => genre.ItemGenres)
            .HasForeignKey(itemGenre => itemGenre.GenreId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(itemGenre => itemGenre.GenreId);
    }
}
