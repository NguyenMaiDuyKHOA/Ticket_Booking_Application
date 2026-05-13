using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payment");
        builder.HasKey(payment => payment.Id);

        builder.Property(payment => payment.Amount).HasPrecision(12, 2).IsRequired();
        builder.Property(payment => payment.Provider).HasMaxLength(100).IsRequired();
        builder.Property(payment => payment.TransactionId).HasMaxLength(200);
        builder.Property(payment => payment.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(payment => payment.CreatedAt).IsRequired();

        builder.HasOne(payment => payment.Booking)
            .WithOne(booking => booking.Payment)
            .HasForeignKey<Payment>(payment => payment.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(payment => payment.BookingId).IsUnique();
        builder.HasIndex(payment => payment.TransactionId);
    }
}
