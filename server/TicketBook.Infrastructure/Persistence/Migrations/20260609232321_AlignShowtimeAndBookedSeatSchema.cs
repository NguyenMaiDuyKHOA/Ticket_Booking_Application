using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBook.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AlignShowtimeAndBookedSeatSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Showtime_Cinema_CinemaId",
                table: "Showtime");

            migrationBuilder.DropForeignKey(
                name: "FK_Showtime_Movie_MovieId",
                table: "Showtime");

            migrationBuilder.DropIndex(
                name: "IX_Showtime_CinemaId",
                table: "Showtime");

            migrationBuilder.DropIndex(
                name: "IX_Showtime_MovieId_CinemaId_StartTime",
                table: "Showtime");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Showtime_StandardSeatPrice_Positive",
                table: "Showtime");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Showtime_Time_Range",
                table: "Showtime");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Showtime_VipSeatPrice_Positive",
                table: "Showtime");

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM "Showtime"
                        WHERE "ItemId" IS NULL OR "VenueId" IS NULL OR "HallId" IS NULL
                    ) THEN
                        RAISE EXCEPTION 'Cannot migrate Showtime: ItemId, VenueId, and HallId must be populated before applying AlignShowtimeAndBookedSeatSchema.';
                    END IF;
                END $$;
                """);

            migrationBuilder.DropColumn(
                name: "CinemaId",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "MovieId",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "RoomNumber",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "StandardSeatPrice",
                table: "Showtime");

            migrationBuilder.DropColumn(
                name: "VipSeatPrice",
                table: "Showtime");

            migrationBuilder.AlterColumn<Guid>(
                name: "VenueId",
                table: "Showtime",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ItemId",
                table: "Showtime",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "HallId",
                table: "Showtime",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "BookedSeat",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ShowtimeId = table.Column<Guid>(type: "uuid", nullable: false),
                    SeatId = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookedSeat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookedSeat_Booking_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Booking",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookedSeat_Seat_SeatId",
                        column: x => x.SeatId,
                        principalTable: "Seat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookedSeat_Showtime_ShowtimeId",
                        column: x => x.ShowtimeId,
                        principalTable: "Showtime",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.Sql("""
                INSERT INTO "BookedSeat" ("Id", "ShowtimeId", "SeatId", "BookingId", "CreatedAt", "IsDeleted")
                SELECT gen_random_uuid(), b."ShowtimeId", t."SeatId", b."Id", NOW(), FALSE
                FROM "Ticket" AS t
                INNER JOIN "Booking" AS b ON b."Id" = t."BookingId"
                WHERE b."Status" <> 'Cancelled';
                """);

            migrationBuilder.CreateIndex(
                name: "IX_BookedSeat_BookingId",
                table: "BookedSeat",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BookedSeat_SeatId",
                table: "BookedSeat",
                column: "SeatId");

            migrationBuilder.CreateIndex(
                name: "IX_BookedSeat_ShowtimeId_SeatId",
                table: "BookedSeat",
                columns: new[] { "ShowtimeId", "SeatId" },
                unique: true,
                filter: "\"IsDeleted\" = FALSE");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookedSeat");

            migrationBuilder.AlterColumn<Guid>(
                name: "VenueId",
                table: "Showtime",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "ItemId",
                table: "Showtime",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "HallId",
                table: "Showtime",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "CinemaId",
                table: "Showtime",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "EndTime",
                table: "Showtime",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "MovieId",
                table: "Showtime",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "RoomNumber",
                table: "Showtime",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "StandardSeatPrice",
                table: "Showtime",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "VipSeatPrice",
                table: "Showtime",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_CinemaId",
                table: "Showtime",
                column: "CinemaId");

            migrationBuilder.CreateIndex(
                name: "IX_Showtime_MovieId_CinemaId_StartTime",
                table: "Showtime",
                columns: new[] { "MovieId", "CinemaId", "StartTime" });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Showtime_StandardSeatPrice_Positive",
                table: "Showtime",
                sql: "\"StandardSeatPrice\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Showtime_Time_Range",
                table: "Showtime",
                sql: "\"EndTime\" > \"StartTime\"");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Showtime_VipSeatPrice_Positive",
                table: "Showtime",
                sql: "\"VipSeatPrice\" > 0");

            migrationBuilder.AddForeignKey(
                name: "FK_Showtime_Cinema_CinemaId",
                table: "Showtime",
                column: "CinemaId",
                principalTable: "Cinema",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Showtime_Movie_MovieId",
                table: "Showtime",
                column: "MovieId",
                principalTable: "Movie",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
