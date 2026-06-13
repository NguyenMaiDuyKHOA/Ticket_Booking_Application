using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveVenueFromHall : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hall_Venue_VenueId",
                table: "Hall");

            migrationBuilder.DropIndex(
                name: "IX_Hall_VenueId_HallTypeId",
                table: "Hall");

            migrationBuilder.DropIndex(
                name: "IX_Hall_VenueId_Name",
                table: "Hall");

            migrationBuilder.DropColumn(
                name: "VenueId",
                table: "Hall");

            migrationBuilder.CreateIndex(
                name: "IX_Hall_Name",
                table: "Hall",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Hall_Name",
                table: "Hall");

            migrationBuilder.AddColumn<Guid>(
                name: "VenueId",
                table: "Hall",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

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
    }
}
