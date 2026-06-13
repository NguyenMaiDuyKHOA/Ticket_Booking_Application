using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeEventLocationMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Item" AS item
                SET "Metadata" = jsonb_build_object(
                    'cityId',
                    CASE
                        WHEN lower(item."Metadata" ->> 'location') LIKE '%hà nội%'
                            OR lower(item."Metadata" ->> 'location') LIKE '%ha noi%'
                            OR lower(item."Metadata" ->> 'location') LIKE '%hanoi%'
                            THEN '55555555-5555-5555-5555-555555555552'::uuid
                        WHEN lower(item."Metadata" ->> 'location') LIKE '%đà nẵng%'
                            OR lower(item."Metadata" ->> 'location') LIKE '%da nang%'
                            OR lower(item."Metadata" ->> 'location') LIKE '%danang%'
                            THEN '55555555-5555-5555-5555-555555555553'::uuid
                        ELSE '55555555-5555-5555-5555-555555555551'::uuid
                    END,
                    'detailLocation',
                    COALESCE(item."Metadata" ->> 'location', '')
                )
                FROM "ItemType" AS itemType
                WHERE item."ItemTypeId" = itemType."Id"
                    AND itemType."Slug" = 'event'
                    AND NOT item."Metadata" ? 'cityId';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Item" AS item
                SET "Metadata" = jsonb_build_object(
                    'format',
                    'Event',
                    'location',
                    COALESCE(item."Metadata" ->> 'detailLocation', '')
                )
                FROM "ItemType" AS itemType
                WHERE item."ItemTypeId" = itemType."Id"
                    AND itemType."Slug" = 'event'
                    AND item."Metadata" ? 'cityId';
                """);
        }
    }
}
