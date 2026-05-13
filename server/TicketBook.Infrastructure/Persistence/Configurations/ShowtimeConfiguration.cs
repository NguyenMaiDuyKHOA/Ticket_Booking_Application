using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class ShowtimeConfiguration : IEntityTypeConfiguration<Showtime>
{
    public void Configure(EntityTypeBuilder<Showtime> builder)
    {
        builder.ToTable("Showtime");
        builder.HasKey(showtime => showtime.Id);

        builder.Property(showtime => showtime.StartTime).IsRequired();
        builder.Property(showtime => showtime.EndTime).IsRequired();
        builder.Property(showtime => showtime.RoomNumber).HasMaxLength(50).IsRequired();
        builder.Property(showtime => showtime.StandardSeatPrice).HasPrecision(12, 2).IsRequired();
        builder.Property(showtime => showtime.VipSeatPrice).HasPrecision(12, 2).IsRequired();

        builder.HasOne(showtime => showtime.Movie)
            .WithMany(movie => movie.Showtimes)
            .HasForeignKey(showtime => showtime.MovieId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(showtime => showtime.Cinema)
            .WithMany(cinema => cinema.Showtimes)
            .HasForeignKey(showtime => showtime.CinemaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(showtime => new { showtime.MovieId, showtime.CinemaId, showtime.StartTime });
        builder.HasIndex(showtime => showtime.StartTime);
    }
}
