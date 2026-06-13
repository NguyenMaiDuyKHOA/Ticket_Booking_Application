using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddItemTypeToGenres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Genre_Slug",
                table: "Genre");

            migrationBuilder.AddColumn<Guid>(
                name: "ItemTypeId",
                table: "Genre",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE "Genre" AS genre
                SET "ItemTypeId" = item_type."Id"
                FROM "ItemType" AS item_type
                WHERE item_type."Slug" = CASE
                    WHEN genre."Slug" IN ('action', 'comedy', 'drama') THEN 'theater'
                    WHEN genre."Slug" IN ('festival', 'workshop') THEN 'event'
                    WHEN genre."Slug" = 'music' THEN 'concert'
                    WHEN genre."Slug" = 'adventure' THEN 'tour'
                    WHEN genre."Slug" = 'family' THEN 'sport'
                    ELSE 'event'
                END;
                """);

            migrationBuilder.Sql("""
                UPDATE "Genre" AS genre
                SET "ItemTypeId" = item_type."Id"
                FROM "ItemType" AS item_type
                WHERE genre."ItemTypeId" IS NULL
                    AND item_type."Slug" = 'event';
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "ItemTypeId",
                table: "Genre",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Genre_ItemTypeId_Slug",
                table: "Genre",
                columns: new[] { "ItemTypeId", "Slug" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Genre_ItemType_ItemTypeId",
                table: "Genre",
                column: "ItemTypeId",
                principalTable: "ItemType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Genre_ItemType_ItemTypeId",
                table: "Genre");

            migrationBuilder.DropIndex(
                name: "IX_Genre_ItemTypeId_Slug",
                table: "Genre");

            migrationBuilder.DropColumn(
                name: "ItemTypeId",
                table: "Genre");

            migrationBuilder.CreateIndex(
                name: "IX_Genre_Slug",
                table: "Genre",
                column: "Slug",
                unique: true);
        }
    }
}
