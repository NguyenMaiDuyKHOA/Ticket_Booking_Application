using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeCinemaItemTypeDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "ItemType"
                SET "Description" = 'Cinema items and screenings.'
                WHERE "Slug" = 'cinema';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // This migration normalizes legacy seed data after the item type rename.
            // Reintroducing the old theater wording would make the catalog inconsistent again.
        }
    }
}
