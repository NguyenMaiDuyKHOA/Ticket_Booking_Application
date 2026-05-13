using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class MovieConfiguration : IEntityTypeConfiguration<Movie>
{
    public void Configure(EntityTypeBuilder<Movie> builder)
    {
        builder.ToTable("Movie");
        builder.HasKey(movie => movie.Id);

        builder.Property(movie => movie.Type).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(movie => movie.Title).HasMaxLength(200).IsRequired();
        builder.Property(movie => movie.Description).HasMaxLength(2000).IsRequired();
        builder.Property(movie => movie.Duration).IsRequired();
        builder.Property(movie => movie.Genre).HasMaxLength(100).IsRequired();
        builder.Property(movie => movie.PosterUrl).HasMaxLength(1000);
        builder.Property(movie => movie.ReleaseDate).IsRequired();
        builder.Property(movie => movie.AgeRating).HasMaxLength(20).IsRequired();

        builder.HasIndex(movie => movie.Title);
        builder.HasIndex(movie => movie.Genre);
        builder.HasIndex(movie => movie.ReleaseDate);
    }
}
