using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class ReviewConfiguration : BaseEntityConfiguration<Review>
{
    public override void Configure(EntityTypeBuilder<Review> builder)
    {
        base.Configure(builder);
        builder.ToTable("Review", table =>
        {
            table.HasCheckConstraint("CK_Review_Rating_Range", "\"Rating\" >= 1 AND \"Rating\" <= 5");
        });

        builder.Property(review => review.Rating).IsRequired();
        builder.Property(review => review.Comment).HasMaxLength(2000);

        builder.HasOne(review => review.Item)
            .WithMany(item => item.Reviews)
            .HasForeignKey(review => review.ItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(review => review.User)
            .WithMany(user => user.Reviews)
            .HasForeignKey(review => review.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(review => new { review.ItemId, review.UserId }).IsUnique();
        builder.HasIndex(review => new { review.ItemId, review.Rating });
    }
}
