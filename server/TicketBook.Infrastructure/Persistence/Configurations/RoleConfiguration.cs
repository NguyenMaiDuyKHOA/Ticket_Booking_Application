using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBook.Domain.Entities;

namespace TicketBook.Infrastructure.Persistence.Configurations;

public sealed class RoleConfiguration : BaseEntityConfiguration<Role>
{
    public override void Configure(EntityTypeBuilder<Role> builder)
    {
        base.Configure(builder);
        builder.ToTable("Role");

        builder.Property(role => role.Name).HasMaxLength(80).IsRequired();
        builder.Property(role => role.NormalizedName).HasMaxLength(80).IsRequired();

        builder.HasIndex(role => role.NormalizedName).IsUnique();
    }
}
