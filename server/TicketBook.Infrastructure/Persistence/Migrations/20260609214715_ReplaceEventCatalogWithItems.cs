using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceEventCatalogWithItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Review_Event_EventId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Showtime_Event_EventId",
                table: "Showtime");

            migrationBuilder.DropTable(
                name: "EventGenre");

            migrationBuilder.DropTable(
                name: "EventImage");

            migrationBuilder.DropTable(
                name: "Genre");

            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.DropTable(
                name: "EventCategory");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "Showtime",
                newName: "ItemId");

            migrationBuilder.RenameIndex(
                name: "IX_Showtime_EventId_VenueId_HallId_StartTime",
                table: "Showtime",
                newName: "IX_Showtime_ItemId_VenueId_HallId_StartTime");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "Review",
                newName: "ItemId");

            migrationBuilder.RenameIndex(
                name: "IX_Review_EventId_UserId",
                table: "Review",
                newName: "IX_Review_ItemId_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Review_EventId_Rating",
                table: "Review",
                newName: "IX_Review_ItemId_Rating");

            migrationBuilder.CreateTable(
                name: "Item",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    Slug = table.Column<string>(type: "character varying(280)", maxLength: 280, nullable: false),
                    ItemType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Price = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    PosterUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Metadata = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Item", x => x.Id);
                    table.CheckConstraint("CK_Item_Metadata_IsJson", "jsonb_typeof(\"Metadata\") IS NOT NULL");
                    table.CheckConstraint("CK_Item_Price_NonNegative", "\"Price\" >= 0");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemType_Status",
                table: "Item",
                columns: new[] { "ItemType", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Item_Price",
                table: "Item",
                column: "Price");

            migrationBuilder.CreateIndex(
                name: "IX_Item_Slug",
                table: "Item",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Item_Title",
                table: "Item",
                column: "Title");

            migrationBuilder.AddForeignKey(
                name: "FK_Review_Item_ItemId",
                table: "Review",
                column: "ItemId",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Showtime_Item_ItemId",
                table: "Showtime",
                column: "ItemId",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Review_Item_ItemId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Showtime_Item_ItemId",
                table: "Showtime");

            migrationBuilder.DropTable(
                name: "Item");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                table: "Showtime",
                newName: "EventId");

            migrationBuilder.RenameIndex(
                name: "IX_Showtime_ItemId_VenueId_HallId_StartTime",
                table: "Showtime",
                newName: "IX_Showtime_EventId_VenueId_HallId_StartTime");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                table: "Review",
                newName: "EventId");

            migrationBuilder.RenameIndex(
                name: "IX_Review_ItemId_UserId",
                table: "Review",
                newName: "IX_Review_EventId_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Review_ItemId_Rating",
                table: "Review",
                newName: "IX_Review_EventId_Rating");

            migrationBuilder.CreateTable(
                name: "EventCategory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Slug = table.Column<string>(type: "character varying(140)", maxLength: 140, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventCategory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Genre",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Slug = table.Column<string>(type: "character varying(140)", maxLength: 140, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genre", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Event",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EventCategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    AgeRating = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    ReleaseDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Slug = table.Column<string>(type: "character varying(280)", maxLength: 280, nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Title = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Event", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Event_EventCategory_EventCategoryId",
                        column: x => x.EventCategoryId,
                        principalTable: "EventCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventGenre",
                columns: table => new
                {
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    GenreId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventGenre", x => new { x.EventId, x.GenreId });
                    table.ForeignKey(
                        name: "FK_EventGenre_Event_EventId",
                        column: x => x.EventId,
                        principalTable: "Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventGenre_Genre_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genre",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventImage",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    AltText = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    IsPrimary = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventImage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventImage_Event_EventId",
                        column: x => x.EventId,
                        principalTable: "Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Event_EventCategoryId_Status",
                table: "Event",
                columns: new[] { "EventCategoryId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Event_ReleaseDate",
                table: "Event",
                column: "ReleaseDate");

            migrationBuilder.CreateIndex(
                name: "IX_Event_Slug",
                table: "Event",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Event_Title",
                table: "Event",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_EventCategory_Slug",
                table: "EventCategory",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventGenre_GenreId",
                table: "EventGenre",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_EventImage_EventId_IsPrimary",
                table: "EventImage",
                columns: new[] { "EventId", "IsPrimary" });

            migrationBuilder.CreateIndex(
                name: "IX_EventImage_EventId_SortOrder",
                table: "EventImage",
                columns: new[] { "EventId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Genre_Slug",
                table: "Genre",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Review_Event_EventId",
                table: "Review",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Showtime_Event_EventId",
                table: "Showtime",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
