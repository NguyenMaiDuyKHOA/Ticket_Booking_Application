using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameTheaterItemTypeToCinema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "ItemType"
                SET "Name" = 'Cinema',
                    "Slug" = 'cinema',
                    "Description" = 'Cinema items and screenings.'
                WHERE "Slug" = 'theater';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "ItemType"
                SET "Name" = 'Theater',
                    "Slug" = 'theater',
                    "Description" = 'Theater performances and stage plays.'
                WHERE "Slug" = 'cinema';
                """);
        }
    }
}
