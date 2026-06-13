using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class CityConfiguration : BaseEntityConfiguration<City>
{
    public static readonly Guid HoChiMinhCityId = Guid.Parse("55555555-5555-5555-5555-555555555551");
    public static readonly Guid HaNoiId = Guid.Parse("55555555-5555-5555-5555-555555555552");
    public static readonly Guid DaNangId = Guid.Parse("55555555-5555-5555-5555-555555555553");

    public override void Configure(EntityTypeBuilder<City> builder)
    {
        base.Configure(builder);
        builder.ToTable("City");

        builder.Property(city => city.Name).HasMaxLength(120).IsRequired();
        builder.Property(city => city.Slug).HasMaxLength(140).IsRequired();

        builder.HasIndex(city => city.Name).IsUnique();
        builder.HasIndex(city => city.Slug).IsUnique();

        builder.HasData(
            new City
            {
                Id = HoChiMinhCityId,
                Name = "TP. Hồ Chí Minh",
                Slug = "ho-chi-minh",
                CreatedAt = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero)
            },
            new City
            {
                Id = HaNoiId,
                Name = "Hà Nội",
                Slug = "ha-noi",
                CreatedAt = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero)
            },
            new City
            {
                Id = DaNangId,
                Name = "Đà Nẵng",
                Slug = "da-nang",
                CreatedAt = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero)
            });
    }
}
