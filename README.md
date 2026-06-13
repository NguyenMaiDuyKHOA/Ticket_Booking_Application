# Ticket Booking Application

A modern ticket booking platform built to support multiple types of content, including movies, concerts, sports events, theater performances, workshops, and exhibitions.

The project is designed with scalability in mind, using Clean Architecture on the backend and a modern React-based frontend.

---

## Overview

Ticket Booking Application is a full-stack system that allows users to browse events, view schedules, and book tickets, while administrators can manage content, venues, halls, and showtimes through a dedicated dashboard.

Unlike traditional movie-only booking systems, the platform is designed around a generic **Item** model, allowing multiple content types to coexist within the same architecture.

Supported content types:

* Movie
* Concert
* Sport Event
* Theater
* Workshop
* Exhibition

---

## Key Features

### Customer

* Browse available items
* Search and filter content
* View item details
* View schedules and showtimes
* View venue information
* Multi-language support
* Responsive UI

### Administration

* Item Management
* Venue Management
* Hall Management
* Showtime Management
* Genre Management
* Rich Text Content Editor
* Image & Poster Upload
* Metadata Management

---

## Architecture

### Backend

The backend follows Clean Architecture principles.

```text
server/
│
├── TicketBook.API
├── TicketBook.Application
├── TicketBook.Domain
├── TicketBook.Infrastructure
└── TicketBook.Persistence
```

#### Domain

Contains:

* Entities
* Enums
* Domain Rules
* Business Models

#### Application

Contains:

* Use Cases
* DTOs
* Validators
* Interfaces
* Application Services

#### Infrastructure

Contains:

* Database Access
* Authentication
* External Services
* File Storage

#### API

Contains:

* Controllers
* Middleware
* Dependency Injection
* API Configuration

---

### Frontend

```text
client/
│
├── app
├── components
├── hooks
├── services
├── lib
├── types
└── locales
```

Built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* i18next
* Lucide React

---

## Domain Model

### Item

Represents any bookable content.

Examples:

* Movie
* Concert
* Sport Event
* Workshop

### Venue

Represents a physical location.

Examples:

* Cinema
* Theater
* Stadium
* Exhibition Center

### Hall

Represents a room or area inside a venue.

Examples:

* Hall 1
* Hall 2
* IMAX
* 4DX
* VIP Area

### Showtime

Represents a scheduled session.

```text
Item
 └── Showtimes

Venue
 └── Halls
      └── Showtimes
```

---

## Database Design

Database Engine:

```text
PostgreSQL
```

Key relationships:

```text
Venue (1)
 └── (N) Halls

Hall (1)
 └── (N) Showtimes

Item (1)
 └── (N) Showtimes
```

Showtime stores:

```text
ItemId
HallId
StartTime
EndTime
Price
Status
```

VenueId is intentionally not stored in Showtime because Hall already belongs to a Venue.

---

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* i18next

### Backend

* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* JWT Authentication

### Development Tools

* DBeaver
* Git
* GitHub
* VS Code

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/NguyenMaiDuyKHOA/Ticket_Booking_Application.git
```

---

### Backend

```bash
cd server

dotnet restore

dotnet ef database update

dotnet run --project TicketBook.API
```

---

### Frontend

```bash
cd client

npm install

npm run dev
```

---

## Environment Variables

Example:

```env
ConnectionStrings__DefaultConnection=

Jwt__Key=
Jwt__Issuer=
Jwt__Audience=

Cloudinary__CloudName=
Cloudinary__ApiKey=
Cloudinary__ApiSecret=
```

Never commit production secrets.

---

## Project Status

Current Progress:

* Item Management
* Venue Management
* Hall Management
* Showtime Management
* Multi-language Support
* Rich Text Content Support

Planned Features:

* Seat Selection
* Ticket Booking Flow
* Online Payment
* Reviews & Ratings
* Analytics Dashboard
* Redis Caching
* Real-time Availability

---

## Author

Khoa Duy

GitHub:
https://github.com/NguyenMaiDuyKHOA
