using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AlignVenueHallSeatSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seat_Showtime_ShowtimeId",
                table: "Seat");

            migrationBuilder.DropIndex(
                name: "IX_Seat_HallId_SeatNumber",
                table: "Seat");

            migrationBuilder.DropIndex(
                name: "IX_Seat_ShowtimeId_IsBooked",
                table: "Seat");

            migrationBuilder.DropIndex(
                name: "IX_Seat_ShowtimeId_SeatNumber",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Venue");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Venue");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Venue");

            migrationBuilder.DropColumn(
                name: "IsBooked",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "SeatNumber",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "ShowtimeId",
                table: "Seat");

            migrationBuilder.AlterColumn<Guid>(
                name: "HallId",
                table: "Seat",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Number",
                table: "Seat",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Row",
                table: "Seat",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HallType",
                table: "Hall",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Seat_HallId_Row_Number",
                table: "Seat",
                columns: new[] { "HallId", "Row", "Number" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seat_HallId_SeatType",
                table: "Seat",
                columns: new[] { "HallId", "SeatType" });

            migrationBuilder.CreateIndex(
                name: "IX_Hall_VenueId_HallType",
                table: "Hall",
                columns: new[] { "VenueId", "HallType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seat_HallId_Row_Number",
                table: "Seat");

            migrationBuilder.DropIndex(
                name: "IX_Seat_HallId_SeatType",
                table: "Seat");

            migrationBuilder.DropIndex(
                name: "IX_Hall_VenueId_HallType",
                table: "Hall");

            migrationBuilder.DropColumn(
                name: "Number",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "Row",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "HallType",
                table: "Hall");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Venue",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "Venue",
                type: "numeric(9,6)",
                precision: 9,
                scale: 6,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "Venue",
                type: "numeric(9,6)",
                precision: 9,
                scale: 6,
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "HallId",
                table: "Seat",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<bool>(
                name: "IsBooked",
                table: "Seat",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SeatNumber",
                table: "Seat",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "ShowtimeId",
                table: "Seat",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Seat_HallId_SeatNumber",
                table: "Seat",
                columns: new[] { "HallId", "SeatNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seat_ShowtimeId_IsBooked",
                table: "Seat",
                columns: new[] { "ShowtimeId", "IsBooked" });

            migrationBuilder.CreateIndex(
                name: "IX_Seat_ShowtimeId_SeatNumber",
                table: "Seat",
                columns: new[] { "ShowtimeId", "SeatNumber" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Seat_Showtime_ShowtimeId",
                table: "Seat",
                column: "ShowtimeId",
                principalTable: "Showtime",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
