using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateItemTypeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Item_ItemType_Status",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "ItemType",
                table: "Item");

            migrationBuilder.AddColumn<Guid>(
                name: "ItemTypeId",
                table: "Item",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "ItemType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Slug = table.Column<string>(type: "character varying(140)", maxLength: 140, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemType", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemTypeId_Status",
                table: "Item",
                columns: new[] { "ItemTypeId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_ItemType_Slug",
                table: "ItemType",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Item_ItemType_ItemTypeId",
                table: "Item",
                column: "ItemTypeId",
                principalTable: "ItemType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_ItemType_ItemTypeId",
                table: "Item");

            migrationBuilder.DropTable(
                name: "ItemType");

            migrationBuilder.DropIndex(
                name: "IX_Item_ItemTypeId_Status",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "ItemTypeId",
                table: "Item");

            migrationBuilder.AddColumn<string>(
                name: "ItemType",
                table: "Item",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemType_Status",
                table: "Item",
                columns: new[] { "ItemType", "Status" });
        }
    }
}
