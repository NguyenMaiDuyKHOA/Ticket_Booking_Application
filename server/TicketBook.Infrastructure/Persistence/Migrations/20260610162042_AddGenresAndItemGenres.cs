using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGenresAndItemGenres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Genre",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Slug = table.Column<string>(type: "character varying(140)", maxLength: 140, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genre", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ItemGenre",
                columns: table => new
                {
                    ItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    GenreId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemGenre", x => new { x.ItemId, x.GenreId });
                    table.ForeignKey(
                        name: "FK_ItemGenre_Genre_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genre",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemGenre_Item_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Genre_Name",
                table: "Genre",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Genre_Slug",
                table: "Genre",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemGenre_GenreId",
                table: "ItemGenre",
                column: "GenreId");

            migrationBuilder.Sql("""
                INSERT INTO "Genre" ("Name", "Slug", "Description", "IsDeleted")
                VALUES
                    ('Action', 'action', 'High-energy experiences with action-driven content.', FALSE),
                    ('Adventure', 'adventure', 'Exploration, journeys, and discovery-focused content.', FALSE),
                    ('Comedy', 'comedy', 'Light-hearted content designed around humor.', FALSE),
                    ('Drama', 'drama', 'Character-driven and emotional storytelling.', FALSE),
                    ('Family', 'family', 'Content suitable for family audiences.', FALSE),
                    ('Festival', 'festival', 'Large-scale festivals and multi-activity experiences.', FALSE),
                    ('Music', 'music', 'Music-centered events and performances.', FALSE),
                    ('Workshop', 'workshop', 'Learning, training, and skill-building sessions.', FALSE)
                ON CONFLICT ("Slug") DO NOTHING;
                """);

            migrationBuilder.Sql("""
                UPDATE "Item" AS item
                SET "Metadata" = item."Metadata" - 'category'
                FROM "ItemType" AS item_type
                WHERE item."ItemTypeId" = item_type."Id"
                    AND item_type."Slug" IN ('event', 'theater')
                    AND item."Metadata" ? 'category';
                """);

            migrationBuilder.Sql("""
                DO $$
                DECLARE
                    movie_type_id uuid;
                    theater_type_id uuid;
                BEGIN
                    SELECT "Id" INTO movie_type_id
                    FROM "ItemType"
                    WHERE "Slug" = 'movie'
                    LIMIT 1;

                    IF movie_type_id IS NULL THEN
                        RETURN;
                    END IF;

                    SELECT "Id" INTO theater_type_id
                    FROM "ItemType"
                    WHERE "Slug" = 'theater'
                    LIMIT 1;

                    IF theater_type_id IS NULL THEN
                        INSERT INTO "ItemType" ("Name", "Slug", "Description", "IsDeleted")
                        VALUES ('Theater', 'theater', 'Theater performances and stage plays.', FALSE)
                        RETURNING "Id" INTO theater_type_id;
                    END IF;

                    -- Preserve existing catalog rows before removing the deprecated movie item type.
                    UPDATE "Item"
                    SET "ItemTypeId" = theater_type_id
                    WHERE "ItemTypeId" = movie_type_id;

                    DELETE FROM "ItemType"
                    WHERE "Id" = movie_type_id;
                END $$;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemGenre");

            migrationBuilder.DropTable(
                name: "Genre");

            migrationBuilder.Sql("""
                INSERT INTO "ItemType" ("Name", "Slug", "Description", "IsDeleted")
                SELECT 'Movie', 'movie', 'Movies and cinema screenings.', FALSE
                WHERE NOT EXISTS (
                    SELECT 1 FROM "ItemType" WHERE "Slug" = 'movie'
                );
                """);
        }
    }
}
