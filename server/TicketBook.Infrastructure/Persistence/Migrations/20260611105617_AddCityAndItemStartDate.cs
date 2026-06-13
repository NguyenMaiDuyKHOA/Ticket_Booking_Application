using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCityAndItemStartDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "City",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Slug = table.Column<string>(type: "character varying(140)", maxLength: 140, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_City", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "City",
                columns: new[] { "Id", "CreatedAt", "DeletedAt", "IsDeleted", "Name", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555551"), new DateTimeOffset(new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, false, "TP. Hồ Chí Minh", "ho-chi-minh", null },
                    { new Guid("55555555-5555-5555-5555-555555555552"), new DateTimeOffset(new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, false, "Hà Nội", "ha-noi", null },
                    { new Guid("55555555-5555-5555-5555-555555555553"), new DateTimeOffset(new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, false, "Đà Nẵng", "da-nang", null }
                });

            migrationBuilder.AddColumn<Guid>(
                name: "CityId",
                table: "Venue",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("55555555-5555-5555-5555-555555555551"));

            migrationBuilder.Sql("""
                UPDATE "Venue"
                SET "CityId" = CASE
                    WHEN lower("City") IN ('hà nội', 'ha noi', 'hanoi') THEN '55555555-5555-5555-5555-555555555552'::uuid
                    WHEN lower("City") IN ('đà nẵng', 'da nang', 'danang') THEN '55555555-5555-5555-5555-555555555553'::uuid
                    ELSE '55555555-5555-5555-5555-555555555551'::uuid
                END;
                """);

            migrationBuilder.DropIndex(
                name: "IX_Venue_City",
                table: "Venue");

            migrationBuilder.DropIndex(
                name: "IX_Venue_Name_City",
                table: "Venue");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Venue");

            migrationBuilder.AddColumn<DateOnly>(
                name: "StartDate",
                table: "Item",
                type: "date",
                nullable: false,
                defaultValueSql: "CURRENT_DATE");

            migrationBuilder.CreateIndex(
                name: "IX_Venue_CityId",
                table: "Venue",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Venue_Name_CityId",
                table: "Venue",
                columns: new[] { "Name", "CityId" });

            migrationBuilder.CreateIndex(
                name: "IX_Item_StartDate",
                table: "Item",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_City_Name",
                table: "City",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_City_Slug",
                table: "City",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Venue_City_CityId",
                table: "Venue",
                column: "CityId",
                principalTable: "City",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Venue_City_CityId",
                table: "Venue");

            migrationBuilder.DropIndex(
                name: "IX_Venue_CityId",
                table: "Venue");

            migrationBuilder.DropIndex(
                name: "IX_Venue_Name_CityId",
                table: "Venue");

            migrationBuilder.DropIndex(
                name: "IX_Item_StartDate",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Item");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Venue",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("""
                UPDATE "Venue" AS v
                SET "City" = c."Name"
                FROM "City" AS c
                WHERE v."CityId" = c."Id";
                """);

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "Venue");

            migrationBuilder.DropTable(
                name: "City");

            migrationBuilder.CreateIndex(
                name: "IX_Venue_City",
                table: "Venue",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_Venue_Name_City",
                table: "Venue",
                columns: new[] { "Name", "City" });
        }
    }
}
