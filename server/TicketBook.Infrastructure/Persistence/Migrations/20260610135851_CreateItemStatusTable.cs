using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateItemStatusTable : Migration
    {
        private static readonly Guid DraftStatusId = new("11111111-1111-1111-1111-111111111111");
        private static readonly Guid PublishedStatusId = new("22222222-2222-2222-2222-222222222222");
        private static readonly Guid UnpublishedStatusId = new("33333333-3333-3333-3333-333333333333");
        private static readonly Guid ArchivedStatusId = new("44444444-4444-4444-4444-444444444444");

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Item_ItemTypeId_Status",
                table: "Item");

            migrationBuilder.CreateTable(
                name: "ItemStatus",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Slug = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemStatus", x => x.Id);
                });

            migrationBuilder.Sql($"""
                INSERT INTO "ItemStatus" ("Id", "Name", "Slug", "Description", "CreatedAt", "IsDeleted")
                VALUES
                    ('{DraftStatusId}', 'Draft', 'draft', 'Content is being prepared and is not visible to customers.', NOW(), FALSE),
                    ('{PublishedStatusId}', 'Published', 'published', 'Content is visible and available for booking workflows.', NOW(), FALSE),
                    ('{UnpublishedStatusId}', 'Unpublished', 'unpublished', 'Content is hidden without being archived.', NOW(), FALSE),
                    ('{ArchivedStatusId}', 'Archived', 'archived', 'Content is kept for history and should not be edited in normal workflows.', NOW(), FALSE);
                """);

            migrationBuilder.CreateIndex(
                name: "IX_ItemStatus_Name",
                table: "ItemStatus",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemStatus_Slug",
                table: "ItemStatus",
                column: "Slug",
                unique: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ItemStatusId",
                table: "Item",
                type: "uuid",
                nullable: false,
                defaultValue: DraftStatusId);

            migrationBuilder.Sql($"""
                UPDATE "Item"
                SET "ItemStatusId" = CASE LOWER("Status")
                    WHEN 'published' THEN '{PublishedStatusId}'::uuid
                    WHEN 'unpublished' THEN '{UnpublishedStatusId}'::uuid
                    WHEN 'archived' THEN '{ArchivedStatusId}'::uuid
                    ELSE '{DraftStatusId}'::uuid
                END;
                """);

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Item");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemStatusId",
                table: "Item",
                column: "ItemStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemTypeId_ItemStatusId",
                table: "Item",
                columns: new[] { "ItemTypeId", "ItemStatusId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Item_ItemStatus_ItemStatusId",
                table: "Item",
                column: "ItemStatusId",
                principalTable: "ItemStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_ItemStatus_ItemStatusId",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_ItemStatusId",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_ItemTypeId_ItemStatusId",
                table: "Item");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Item",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("""
                UPDATE "Item"
                SET "Status" = COALESCE((
                    SELECT "Name"
                    FROM "ItemStatus"
                    WHERE "ItemStatus"."Id" = "Item"."ItemStatusId"
                ), 'Draft');
                """);

            migrationBuilder.DropColumn(
                name: "ItemStatusId",
                table: "Item");

            migrationBuilder.DropTable(
                name: "ItemStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemTypeId_Status",
                table: "Item",
                columns: new[] { "ItemTypeId", "Status" });
        }
    }
}
