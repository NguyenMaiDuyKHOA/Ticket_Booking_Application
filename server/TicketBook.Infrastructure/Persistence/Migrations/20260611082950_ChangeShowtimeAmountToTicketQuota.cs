using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeShowtimeAmountToTicketQuota : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Showtime" AS s
                SET "Amount" = h."Capacity"
                FROM "Hall" AS h
                WHERE s."HallId" = h."Id";

                ALTER TABLE "Showtime"
                ALTER COLUMN "Amount" TYPE integer
                USING "Amount"::integer;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Showtime"
                ALTER COLUMN "Amount" TYPE numeric(12,2)
                USING "Amount"::numeric;
                """);
        }
    }
}
