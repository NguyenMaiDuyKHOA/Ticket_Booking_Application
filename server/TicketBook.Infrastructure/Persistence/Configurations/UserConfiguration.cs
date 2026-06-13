using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : BaseEntityConfiguration<User>
{
    public override void Configure(EntityTypeBuilder<User> builder)
    {
        base.Configure(builder);
        builder.ToTable("User");

        builder.Property(user => user.FullName).HasMaxLength(150).IsRequired();
        builder.Property(user => user.Email).HasMaxLength(256);
        builder.Property(user => user.Phone).HasMaxLength(20).IsRequired();
        builder.Property(user => user.PasswordHash).HasMaxLength(500).IsRequired();
        builder.Property(user => user.Role).HasConversion<string>().HasMaxLength(30).IsRequired();

        // Phone is the primary login identifier; Email remains optional but unique when provided.
        builder.HasIndex(user => user.Email).IsUnique();
        builder.HasIndex(user => user.Phone).IsUnique();
    }
}
