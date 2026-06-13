using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AlignShowtimeManagementSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Showtime_HallId",
                table: "Showtime");

            migrationBuilder.DropIndex(
                name: "IX_Showtime_ItemId_HallId_StartTime",
                table: "Showtime");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Showtime_Amount_NonNegative",
                table: "Showtime");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "EndTime",
                table: "Showtime",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Showtime",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE "Showtime" AS s
                SET
                    "EndTime" = s."StartTime" + INTERVAL '2 hours',
                    "Price" = COALESCE(i."Price", 0)
                FROM "Item" AS i
                WHERE s."ItemId" = i."Id";
                """);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "EndTime",
                table: "Showtime",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Showtime",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(12,2)",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Showtime");

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_HallId_StartTime_EndTime",
                table: "Showtime",
                columns: new[] { "HallId", "StartTime", "EndTime" });

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_ItemId_StartTime",
                table: "Showtime",
                columns: new[] { "ItemId", "StartTime" });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Showtime_Price_NonNegative",
                table: "Showtime",
                sql: "\"Price\" >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Showtime_TimeRange_Valid",
                table: "Showtime",
                sql: "\"StartTime\" < \"EndTime\"");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Showtime_HallId_StartTime_EndTime",
                table: "Showtime");

            migrationBuilder.DropIndex(
                name: "IX_Showtime_ItemId_StartTime",
                table: "Showtime");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Showtime_Price_NonNegative",
                table: "Showtime");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Showtime_TimeRange_Valid",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Showtime");

            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "Showtime",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql("""
                UPDATE "Showtime" AS s
                SET "Amount" = h."Capacity"
                FROM "Hall" AS h
                WHERE s."HallId" = h."Id";
                """);

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_HallId",
                table: "Showtime",
                column: "HallId");

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_ItemId_HallId_StartTime",
                table: "Showtime",
                columns: new[] { "ItemId", "HallId", "StartTime" });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Showtime_Amount_NonNegative",
                table: "Showtime",
                sql: "\"Amount\" >= 0");
        }
    }
}
