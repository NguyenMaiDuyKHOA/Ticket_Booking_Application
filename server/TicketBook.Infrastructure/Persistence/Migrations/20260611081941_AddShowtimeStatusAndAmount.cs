using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddShowtimeStatusAndAmount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "Showtime",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "ShowtimeStatusId",
                table: "Showtime",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("44444444-4444-4444-4444-444444444441"));

            migrationBuilder.CreateTable(
                name: "ShowtimeStatus",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Slug = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShowtimeStatus", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "ShowtimeStatus",
                columns: new[] { "Id", "CreatedAt", "DeletedAt", "Description", "IsDeleted", "Name", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("44444444-4444-4444-4444-444444444441"), new DateTimeOffset(new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "Showtime is available for booking.", false, "Scheduled", "scheduled", null },
                    { new Guid("44444444-4444-4444-4444-444444444442"), new DateTimeOffset(new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "Showtime has been cancelled and should not accept bookings.", false, "Cancelled", "cancelled", null },
                    { new Guid("44444444-4444-4444-4444-444444444443"), new DateTimeOffset(new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "Showtime has no available seats left.", false, "Sold Out", "sold-out", null },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTimeOffset(new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "Showtime has already ended.", false, "Completed", "completed", null }
                });

            migrationBuilder.Sql("""
                UPDATE "Showtime" AS s
                SET "Amount" = COALESCE(i."Price", 0),
                    "ShowtimeStatusId" = '44444444-4444-4444-4444-444444444441'
                FROM "Item" AS i
                WHERE s."ItemId" = i."Id";
                """);

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_ShowtimeStatusId",
                table: "Showtime",
                column: "ShowtimeStatusId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Showtime_Amount_NonNegative",
                table: "Showtime",
                sql: "\"Amount\" >= 0");

            migrationBuilder.CreateIndex(
                name: "IX_ShowtimeStatus_Name",
                table: "ShowtimeStatus",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShowtimeStatus_Slug",
                table: "ShowtimeStatus",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Showtime_ShowtimeStatus_ShowtimeStatusId",
                table: "Showtime",
                column: "ShowtimeStatusId",
                principalTable: "ShowtimeStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Showtime_ShowtimeStatus_ShowtimeStatusId",
                table: "Showtime");

            migrationBuilder.DropTable(
                name: "ShowtimeStatus");

            migrationBuilder.DropIndex(
                name: "IX_Showtime_ShowtimeStatusId",
                table: "Showtime");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Showtime_Amount_NonNegative",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "ShowtimeStatusId",
                table: "Showtime");
        }
    }
}
