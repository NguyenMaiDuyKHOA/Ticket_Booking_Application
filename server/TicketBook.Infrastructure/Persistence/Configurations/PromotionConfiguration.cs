using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class PromotionConfiguration : BaseEntityConfiguration<Promotion>
{
    public override void Configure(EntityTypeBuilder<Promotion> builder)
    {
        base.Configure(builder);
        builder.ToTable("Promotion", table =>
        {
            table.HasCheckConstraint("CK_Promotion_DiscountValue_Positive", "\"DiscountValue\" > 0");
        });

        builder.Property(promotion => promotion.Code).HasMaxLength(80).IsRequired();
        builder.Property(promotion => promotion.Name).HasMaxLength(200).IsRequired();
        builder.Property(promotion => promotion.DiscountType).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(promotion => promotion.DiscountValue).HasPrecision(12, 2).IsRequired();
        builder.Property(promotion => promotion.MinimumOrderAmount).HasPrecision(12, 2);
        builder.Property(promotion => promotion.MaxDiscountAmount).HasPrecision(12, 2);
        builder.Property(promotion => promotion.Status).HasConversion<string>().HasMaxLength(30).IsRequired();

        builder.HasIndex(promotion => promotion.Code).IsUnique();
        builder.HasIndex(promotion => new { promotion.Status, promotion.StartsAt, promotion.EndsAt });
    }
}
