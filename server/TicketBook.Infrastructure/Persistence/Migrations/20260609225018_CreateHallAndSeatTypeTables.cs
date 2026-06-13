using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateHallAndSeatTypeTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seat_HallId_SeatType",
                table: "Seat");

            migrationBuilder.DropIndex(
                name: "IX_Hall_VenueId_HallType",
                table: "Hall");

            migrationBuilder.CreateTable(
                name: "HallType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Slug = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HallType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SeatType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Slug = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatType", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HallType_Slug",
                table: "HallType",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SeatType_Slug",
                table: "SeatType",
                column: "Slug",
                unique: true);

            migrationBuilder.Sql("""
                INSERT INTO "HallType" ("Id", "Name", "Slug", "CreatedAt", "IsDeleted")
                VALUES
                    ('11111111-1111-1111-1111-111111111111', 'Standard', 'standard', NOW(), FALSE),
                    ('22222222-2222-2222-2222-222222222222', 'IMAX', 'imax', NOW(), FALSE),
                    ('33333333-3333-3333-3333-333333333333', 'VIP', 'vip', NOW(), FALSE),
                    ('44444444-4444-4444-4444-444444444444', 'Stage', 'stage', NOW(), FALSE),
                    ('55555555-5555-5555-5555-555555555555', 'Stadium', 'stadium', NOW(), FALSE)
                ON CONFLICT ("Slug") DO NOTHING;
                """);

            migrationBuilder.Sql("""
                INSERT INTO "SeatType" ("Id", "Name", "Slug", "CreatedAt", "IsDeleted")
                VALUES
                    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Standard', 'standard', NOW(), FALSE),
                    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'VIP', 'vip', NOW(), FALSE),
                    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Couple', 'couple', NOW(), FALSE)
                ON CONFLICT ("Slug") DO NOTHING;
                """);

            migrationBuilder.AddColumn<Guid>(
                name: "SeatTypeId",
                table: "Seat",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "HallTypeId",
                table: "Hall",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE "Hall" AS h
                SET "HallTypeId" = ht."Id"
                FROM "HallType" AS ht
                WHERE ht."Slug" = CASE LOWER(COALESCE(h."HallType", ''))
                    WHEN 'imax' THEN 'imax'
                    WHEN 'vip' THEN 'vip'
                    WHEN 'stage' THEN 'stage'
                    WHEN 'stadium' THEN 'stadium'
                    ELSE 'standard'
                END;
                """);

            migrationBuilder.Sql("""
                UPDATE "Seat" AS s
                SET "SeatTypeId" = st."Id"
                FROM "SeatType" AS st
                WHERE st."Slug" = CASE LOWER(COALESCE(s."SeatType", ''))
                    WHEN 'vip' THEN 'vip'
                    WHEN 'couple' THEN 'couple'
                    ELSE 'standard'
                END;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "SeatTypeId",
                table: "Seat",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "HallTypeId",
                table: "Hall",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "SeatType",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "HallType",
                table: "Hall");

            migrationBuilder.CreateIndex(
                name: "IX_Seat_HallId_SeatTypeId",
                table: "Seat",
                columns: new[] { "HallId", "SeatTypeId" });

            migrationBuilder.CreateIndex(
                name: "IX_Seat_SeatTypeId",
                table: "Seat",
                column: "SeatTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Hall_HallTypeId",
                table: "Hall",
                column: "HallTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Hall_VenueId_HallTypeId",
                table: "Hall",
                columns: new[] { "VenueId", "HallTypeId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Hall_HallType_HallTypeId",
                table: "Hall",
                column: "HallTypeId",
                principalTable: "HallType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Seat_SeatType_SeatTypeId",
                table: "Seat",
                column: "SeatTypeId",
                principalTable: "SeatType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SeatType",
                table: "Seat",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HallType",
                table: "Hall",
                type: "character varying(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE "Seat" AS s
                SET "SeatType" = COALESCE(st."Name", 'Standard')
                FROM "SeatType" AS st
                WHERE s."SeatTypeId" = st."Id";
                """);

            migrationBuilder.Sql("""
                UPDATE "Hall" AS h
                SET "HallType" = COALESCE(ht."Name", 'Standard')
                FROM "HallType" AS ht
                WHERE h."HallTypeId" = ht."Id";
                """);

            migrationBuilder.AlterColumn<string>(
                name: "SeatType",
                table: "Seat",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(30)",
                oldMaxLength: 30,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HallType",
                table: "Hall",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(40)",
                oldMaxLength: 40,
                oldNullable: true);

            migrationBuilder.DropForeignKey(
                name: "FK_Hall_HallType_HallTypeId",
                table: "Hall");

            migrationBuilder.DropForeignKey(
                name: "FK_Seat_SeatType_SeatTypeId",
                table: "Seat");

            migrationBuilder.DropTable(
                name: "HallType");

            migrationBuilder.DropTable(
                name: "SeatType");

            migrationBuilder.DropIndex(
                name: "IX_Seat_HallId_SeatTypeId",
                table: "Seat");

            migrationBuilder.DropIndex(
                name: "IX_Seat_SeatTypeId",
                table: "Seat");

            migrationBuilder.DropIndex(
                name: "IX_Hall_HallTypeId",
                table: "Hall");

            migrationBuilder.DropIndex(
                name: "IX_Hall_VenueId_HallTypeId",
                table: "Hall");

            migrationBuilder.DropColumn(
                name: "SeatTypeId",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "HallTypeId",
                table: "Hall");

            migrationBuilder.CreateIndex(
                name: "IX_Seat_HallId_SeatType",
                table: "Seat",
                columns: new[] { "HallId", "SeatType" });

            migrationBuilder.CreateIndex(
                name: "IX_Hall_VenueId_HallType",
                table: "Hall",
                columns: new[] { "VenueId", "HallType" });
        }
    }
}
