using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DropTemporaryVenueHallSeatDefaults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE \"Hall\" ALTER COLUMN \"HallType\" DROP DEFAULT;");
            migrationBuilder.Sql("ALTER TABLE \"Seat\" ALTER COLUMN \"HallId\" DROP DEFAULT;");
            migrationBuilder.Sql("ALTER TABLE \"Seat\" ALTER COLUMN \"Row\" DROP DEFAULT;");
            migrationBuilder.Sql("ALTER TABLE \"Seat\" ALTER COLUMN \"Number\" DROP DEFAULT;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE \"Hall\" ALTER COLUMN \"HallType\" SET DEFAULT '';");
            migrationBuilder.Sql("ALTER TABLE \"Seat\" ALTER COLUMN \"HallId\" SET DEFAULT '00000000-0000-0000-0000-000000000000';");
            migrationBuilder.Sql("ALTER TABLE \"Seat\" ALTER COLUMN \"Row\" SET DEFAULT '';");
            migrationBuilder.Sql("ALTER TABLE \"Seat\" ALTER COLUMN \"Number\" SET DEFAULT 0;");
        }
    }
}
