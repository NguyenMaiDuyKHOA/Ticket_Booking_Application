using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddItemTypeToHall : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ItemTypeId",
                table: "Hall",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql("""
                INSERT INTO "ItemType" ("Name", "Slug", "Description", "IsDeleted")
                SELECT 'Theater', 'theater', 'Cinema/theater halls used by the CGV booking flow.', FALSE
                WHERE NOT EXISTS (
                    SELECT 1 FROM "ItemType" WHERE "Slug" = 'theater'
                );
                """);

            migrationBuilder.Sql("""
                UPDATE "Hall" AS hall
                SET "ItemTypeId" = item_type."Id"
                FROM "ItemType" AS item_type
                WHERE hall."ItemTypeId" IS NULL
                    AND item_type."Slug" = 'theater';
                """);

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM "Hall" WHERE "ItemTypeId" IS NULL) THEN
                        RAISE EXCEPTION 'Cannot set Hall.ItemTypeId to NOT NULL because at least one Hall could not be assigned to an ItemType.';
                    END IF;
                END $$;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "ItemTypeId",
                table: "Hall",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Hall_ItemTypeId",
                table: "Hall",
                column: "ItemTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Hall_ItemTypeId_VenueId",
                table: "Hall",
                columns: new[] { "ItemTypeId", "VenueId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Hall_ItemType_ItemTypeId",
                table: "Hall",
                column: "ItemTypeId",
                principalTable: "ItemType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hall_ItemType_ItemTypeId",
                table: "Hall");

            migrationBuilder.DropIndex(
                name: "IX_Hall_ItemTypeId",
                table: "Hall");

            migrationBuilder.DropIndex(
                name: "IX_Hall_ItemTypeId_VenueId",
                table: "Hall");

            migrationBuilder.DropColumn(
                name: "ItemTypeId",
                table: "Hall");
        }
    }
}
