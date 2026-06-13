using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MoveVenueFromShowtimeToHall : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Showtime_Venue_VenueId",
                table: "Showtime");

            migrationBuilder.DropIndex(
                name: "IX_Showtime_ItemId_VenueId_HallId_StartTime",
                table: "Showtime");

            migrationBuilder.DropIndex(
                name: "IX_Showtime_VenueId",
                table: "Showtime");

            migrationBuilder.DropIndex(
                name: "IX_Hall_Name",
                table: "Hall");

            migrationBuilder.AddColumn<Guid>(
                name: "VenueId",
                table: "Hall",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM "Showtime"
                        GROUP BY "HallId"
                        HAVING COUNT(DISTINCT "VenueId") > 1
                    ) THEN
                        RAISE EXCEPTION 'Cannot move VenueId to Hall: at least one hall is used by showtimes in multiple venues.';
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""
                UPDATE "Hall" AS h
                SET "VenueId" = s."VenueId"
                FROM (
                    SELECT "HallId", "VenueId"
                    FROM "Showtime"
                    GROUP BY "HallId", "VenueId"
                ) AS s
                WHERE h."Id" = s."HallId";
                """);

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM "Hall"
                        WHERE "VenueId" IS NULL
                    ) THEN
                        RAISE EXCEPTION 'Cannot move VenueId to Hall: every existing hall must be associated with a venue before applying this migration.';
                    END IF;
                END $$;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "VenueId",
                table: "Hall",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "VenueId",
                table: "Showtime");

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_ItemId_HallId_StartTime",
                table: "Showtime",
                columns: new[] { "ItemId", "HallId", "StartTime" });

            migrationBuilder.CreateIndex(
                name: "IX_Hall_VenueId_HallTypeId",
                table: "Hall",
                columns: new[] { "VenueId", "HallTypeId" });

            migrationBuilder.CreateIndex(
                name: "IX_Hall_VenueId_Name",
                table: "Hall",
                columns: new[] { "VenueId", "Name" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Hall_Venue_VenueId",
                table: "Hall",
                column: "VenueId",
                principalTable: "Venue",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Showtime_ItemId_HallId_StartTime",
                table: "Showtime");

            migrationBuilder.DropIndex(
                name: "IX_Hall_VenueId_HallTypeId",
                table: "Hall");

            migrationBuilder.DropIndex(
                name: "IX_Hall_VenueId_Name",
                table: "Hall");

            migrationBuilder.AddColumn<Guid>(
                name: "VenueId",
                table: "Showtime",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE "Showtime" AS s
                SET "VenueId" = h."VenueId"
                FROM "Hall" AS h
                WHERE s."HallId" = h."Id";
                """);

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM "Showtime"
                        WHERE "VenueId" IS NULL
                    ) THEN
                        RAISE EXCEPTION 'Cannot restore VenueId to Showtime: a showtime references a hall without venue.';
                    END IF;
                END $$;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "VenueId",
                table: "Showtime",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.DropForeignKey(
                name: "FK_Hall_Venue_VenueId",
                table: "Hall");

            migrationBuilder.DropColumn(
                name: "VenueId",
                table: "Hall");

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_ItemId_VenueId_HallId_StartTime",
                table: "Showtime",
                columns: new[] { "ItemId", "VenueId", "HallId", "StartTime" });

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_VenueId",
                table: "Showtime",
                column: "VenueId");

            migrationBuilder.CreateIndex(
                name: "IX_Hall_Name",
                table: "Hall",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Showtime_Venue_VenueId",
                table: "Showtime",
                column: "VenueId",
                principalTable: "Venue",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
