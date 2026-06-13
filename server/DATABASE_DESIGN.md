# TicketBook Database Design

## Domain Analysis

TicketBook now uses a single catalog table named `Item` for shared bookable content: cinema screenings, concerts, events, sports, live shows, tours, and future item types.

This design intentionally avoids small catalog tables such as `EventCategory`, `Genre`, `EventImage`, `Movie`, `Concert`, or `Sport` for every content type. Shared fields are stored as real columns for indexing and filtering. Type-specific fields are stored in `Metadata` as `jsonb`.

## Database Design

Core catalog tables:

`Item`
- `ItemTypeId`
- `ItemStatusId`
- `Title`
- `Slug`
- `Description`
- `Price`
- `ImageUrl`
- `PosterUrl`
- `Metadata` (`jsonb`)
- audit and soft-delete columns from `BaseEntity`

`ItemType`
- `Name`
- `Slug`
- `Description`
- audit and soft-delete columns from `BaseEntity`

`ItemStatus`
- `Name`
- `Slug`
- `Description`
- audit and soft-delete columns from `BaseEntity`

Provider note: the server currently uses PostgreSQL through `UseNpgsql`, so `Metadata` is configured as `jsonb`.

## ERD

```text
ItemType 1--* Item
ItemStatus 1--* Item
Item 1--* Showtime
Item 1--* Review *--1 User
User 1--* Booking *--1 Showtime
User *--* Role via UserRole
Venue 1--* Hall *--1 HallType
Hall 1--* Seat *--1 SeatType
Hall 1--* Showtime
Showtime 1--* Booking 1--* Ticket *--1 Seat
Showtime 1--* BookedSeat *--1 Seat
Booking 1--* BookedSeat
Booking 1--0..1 Payment
Promotion 0..1--* Booking
```

## Entity Definitions

`ItemType`: lookup table for supported item types such as cinema, event, concert, sport, live show, and tour. Indexes: unique `Slug`.

`ItemStatus`: lookup table for catalog workflow states. Seeded values: `draft`, `published`, `unpublished`, `archived`. Indexes: unique `Name`, unique `Slug`.

`Item`: shared catalog item for every ticket type. `Metadata` stores type-specific data as JSONB and is validated in the Application layer for known item types. Indexes: unique `Slug`, `ItemTypeId + ItemStatusId`, `Price`, `Title`.

Known metadata models:
- `cinema`: `score`, `duration`, `ageRating`, `supportedHallTypeIds`
- `event`: `cityId`, `detailLocation`

`User`: account identity. Uses `Phone` as login identifier. Relationships: bookings, roles, reviews. Indexes: unique `Phone`, optional unique `Email`.

`Role`: authorization role such as `User` and `Admin`. Relationships: many users through `UserRole`.

`Venue`: physical location. Properties: `Name`, `Address`, `City`.

`HallType`: lookup table for supported hall/stage types. Seeded values: `standard`, `imax`, `vip`, `stage`, `stadium`. Indexes: unique `Slug`.

`Hall`: bookable space inside a venue. Properties: `VenueId`, `Name`, `Capacity`, `HallTypeId`.

`SeatType`: lookup table for supported seat types. Seeded values: `standard`, `vip`, `couple`. Indexes: unique `Slug`.

`Seat`: physical seat inside a hall. Properties: `HallId`, `Row`, `Number`, `SeatTypeId`.

`Showtime`: scheduled occurrence of an `Item`. Properties: `ItemId`, `HallId`, `StartTime`. Venue is derived through `Hall.VenueId`.

`BookedSeat`: active seat reservation for a specific showtime and booking. Properties: `ShowtimeId`, `SeatId`, `BookingId`. Indexes: unique active `ShowtimeId + SeatId`.

`Booking`, `Ticket`, `Payment`, `Promotion`: booking and payment workflow. `Ticket` stores issued ticket and price information; `BookedSeat` stores seat occupancy.

`Review`: rating/comment for an `Item`.

## Relationship Explanation

One-to-one: `Booking` to `Payment`.

One-to-many: `ItemType` to `Item`, `ItemStatus` to `Item`, `Item` to `Showtime`, `Item` to `Review`, `Showtime` to `Booking`, `Booking` to `Ticket`, `Booking` to `BookedSeat`, `Venue` to `Hall`, `HallType` to `Hall`, `Hall` to `Seat`, `SeatType` to `Seat`.

Seat availability is not stored on `Seat`. Availability is derived from active `BookedSeat` rows for a specific `Showtime`, because the same physical seat can be sold again for another showtime.

Many-to-many: `User` to `Role` via `UserRole`.

## EF Core Configuration

`Item.Metadata` is configured with `HasColumnType("jsonb")`. `Item.ItemTypeId` references `ItemType.Id`. `Item.ItemStatusId` references `ItemStatus.Id`.

Known metadata payloads are kept as typed models in the Domain layer and normalized through Application services before persistence. This preserves the generic `Item` table while avoiding uncontrolled JSON shapes for important item types.

EF Core Fluent API defines indexes and check constraints:
- `Slug` unique
- `ItemTypeId + ItemStatusId`
- `Price >= 0`
- `Metadata` must be valid JSONB

Global soft-delete filters remain applied to all `BaseEntity` entities.

## Migration Strategy

Applied migration: `ReplaceEventCatalogWithItems`.
Applied migration: `CreateItemTypeTable`.
Applied migration: `AlignVenueHallSeatSchema`.
Applied migration: `DropTemporaryVenueHallSeatDefaults`.
Applied migration: `CreateHallAndSeatTypeTables`.
Applied migration: `AlignShowtimeAndBookedSeatSchema`.
Applied migration: `RemoveVenueFromHall`.
Applied migration: `MoveVenueFromShowtimeToHall`.
Applied migration: `DropMovieAndCinemaTables`.
Pending/applied migration: `CreateItemStatusTable`.

Migration effects:
- Created table `Item`.
- Renamed `Showtime.EventId` to `Showtime.ItemId`.
- Renamed `Review.EventId` to `Review.ItemId`.
- Dropped old catalog tables: `Event`, `EventCategory`, `Genre`, `EventGenre`, `EventImage`.
- Added foreign keys from `Showtime` and `Review` to `Item`.
- Created table `ItemType`.
- Replaced `Item.ItemType` string/enum column with `Item.ItemTypeId`.
- Seeded default item types: `cinema`, `event`, `concert`, `sport`, `live-show`, `tour`.
- Created table `ItemStatus`.
- Replaced `Item.Status` enum/string column with `Item.ItemStatusId`.
- Seeded default item statuses: `draft`, `published`, `unpublished`, `archived`.
- Simplified `Venue` to `Id`, `Name`, `Address`, `City` plus audit fields.
- Created table `HallType` and replaced `Hall.HallType` with `Hall.HallTypeId`.
- Created table `SeatType` and replaced `Seat.SeatType` with `Seat.SeatTypeId`.
- Seeded default hall types: `standard`, `imax`, `vip`, `stage`, `stadium`.
- Seeded default seat types: `standard`, `vip`, `couple`.
- Changed `Seat` to belong to `Hall` using `HallId`, `Row`, `Number`, `SeatTypeId`.
- Removed old `Seat.ShowtimeId`, `Seat.SeatNumber`, and `Seat.IsBooked`.
- Simplified `Showtime` to `ItemId`, `HallId`, `StartTime` plus audit fields.
- Removed legacy `Showtime.MovieId`, `CinemaId`, `EndTime`, `RoomNumber`, `StandardSeatPrice`, and `VipSeatPrice`.
- Created table `BookedSeat` with `ShowtimeId`, `SeatId`, `BookingId` plus audit fields.
- Added a unique partial index on active `BookedSeat.ShowtimeId + SeatId` to prevent double-booking.
- Added `Hall.VenueId` and removed `Showtime.VenueId`, so venue is derived through the selected hall.
- Replaced `Showtime.ItemId + VenueId + HallId + StartTime` index with `Showtime.ItemId + HallId + StartTime`.
- Dropped legacy `Movie` and `Cinema` tables. Movies now live as `Item` rows with `ItemType.Slug = 'movie'`; cinema locations should use `Venue` and `Hall`.

The legacy `Movie` and `Cinema` API endpoints have been removed. Catalog content should be managed through `Item`; physical locations should be managed through `Venue` and `Hall`.

Typed metadata models were added for `cinema` and `event`. No database migration is required for metadata shape changes because the existing `Item.Metadata` JSONB column still stores the payload.

## Performance Recommendations

Use `ItemType + ItemStatus` for catalog browsing, `Slug` for detail pages, and `Price` for filtering. For JSONB searches inside `Metadata`, add targeted GIN or expression indexes only when real query patterns appear.

## Security Considerations

Do not trust `Metadata` from clients blindly. Validate allowed metadata keys per `ItemType` in the Application layer before saving. Keep admin-only create/update/delete endpoints protected with role-based authorization.

## Future Expansion Strategy

New ticket types should be added by extending `ItemType` and validating their `Metadata` shape. Only create a dedicated table when a future item type has complex relational behavior that cannot reasonably live in JSONB.
