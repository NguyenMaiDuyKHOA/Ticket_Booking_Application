# AGENTS.md

## Project Overview

Cinema Ticket Booking Application backend built with:

- ASP.NET Core Web API (.NET 8)
- Entity Framework Core 8
- PostgreSQL
- Clean Architecture inspired structure

Purpose:
- Manage movies, cinemas, showtimes, bookings, payments, and users.
- Provide scalable REST APIs for frontend applications such as Next.js clients.

---

# Tech Stack

## Backend
- ASP.NET Core 8 Web API
- Entity Framework Core 8
- JWT Authentication
- FluentValidation
- AutoMapper

## Database
- PostgreSQL

## Architecture
- Domain
- Application
- Infrastructure
- API

---

# Solution Structure

```txt
server/
│
├── TicketBook.API
├── TicketBook.Application
├── TicketBook.Domain
├── TicketBook.Infrastructure
└── TicketBook.sln
```

---

# Folder Responsibilities

# 1. TicketBook.API

Entry point of the application.

Responsible for:
- Controllers
- Authentication setup
- Middleware
- Dependency Injection
- API configuration
- Swagger
- HTTP pipeline

## Structure

```txt
TicketBook.API
│
├── Controllers
├── Extensions
├── Middleware
├── Filters
├── Common
├── appsettings.json
└── Program.cs
```

## Rules

- Do NOT place business logic here.
- Controllers should stay thin.
- Controllers should only:
  - validate request
  - call application services
  - return response

---

# 2. TicketBook.Application

Contains business logic and use cases.

Responsible for:
- Services
- DTOs
- Interfaces
- Validation
- Mapping
- Features
- Application rules

## Structure

```txt
TicketBook.Application
│
├── DTOs
├── Interfaces
├── Services
├── Features
├── Validators
├── Mappings
├── Common
└── Behaviors
```

## Rules

- No direct database implementation.
- No EF Core specific code.
- Depend only on Domain layer.
- Infrastructure implements interfaces defined here.

---

# 3. TicketBook.Domain

Core business domain.

Responsible for:
- Entities
- Enums
- Constants
- Domain rules
- Shared abstractions

## Structure

```txt
TicketBook.Domain
│
├── Entities
├── Enums
├── Constants
├── Common
└── ValueObjects
```

## Rules

- Must NOT depend on other projects.
- Keep pure business models only.
- No infrastructure code.
- No database code.
- No HTTP logic.

---

# 4. TicketBook.Infrastructure

Handles external systems and persistence.

Responsible for:
- Entity Framework Core
- PostgreSQL access
- DbContext
- Repository implementations
- External services
- File storage
- Email services
- Payment gateways

## Structure

```txt
TicketBook.Infrastructure
│
├── Persistence
│   ├── ApplicationDbContext.cs
│   ├── Configurations
│   └── Migrations
│
├── Repositories
├── Services
├── Identity
├── Integrations
└── DependencyInjection
```

---

# Database Design

## Database Provider

PostgreSQL

## Naming Conventions

### Tables
- PascalCase
- Singular preferred

Examples:
- Movie
- Cinema
- Showtime
- Booking

### Columns
- PascalCase

Examples:
- Title
- CreatedAt
- StartTime

---

# Core Entities

## User
Represents application users.

Fields:
- Id
- FullName
- Email
- PasswordHash
- Role
- CreatedAt

---

## Movie

Fields:
- Id
- Type
- Title
- Description
- Duration
- Genre
- PosterUrl
- ReleaseDate
- AgeRating

---

## Cinema

Fields:
- Id
- Name
- Address
- City

---

## Showtime

Fields:
- Id
- MovieId
- CinemaId
- StartTime
- EndTime
- RoomNumber

---

## Seat

Fields:
- Id
- ShowtimeId
- SeatNumber
- SeatType
- IsBooked

---

## Booking

Fields:
- Id
- UserId
- ShowtimeId
- TotalPrice
- Status
- CreatedAt

---

## Ticket

Fields:
- Id
- BookingId
- SeatId
- Price

---

# EF Core Rules

## DbContext Location

```txt
TicketBook.Infrastructure/Persistence/ApplicationDbContext.cs
```

---

## Entity Configurations

All entity configurations must use:

```csharp
IEntityTypeConfiguration<T>
```

Location:

```txt
Persistence/Configurations
```

---

## Migrations

Location:

```txt
Persistence/Migrations
```

Command:

```bash
dotnet ef migrations add Init \
--project TicketBook.Infrastructure \
--startup-project TicketBook.API
```

---

# API Conventions

## REST Naming

### Good
```txt
GET    /api/movies
GET    /api/movies/{id}
POST   /api/bookings
PUT    /api/movies/{id}
DELETE /api/movies/{id}
```

### Bad
```txt
/getMovies
/createMovie
/deleteMovie
```

---

# Error Handling

Use global exception middleware.

Do NOT wrap every controller action in try/catch.

---

# Authentication

Use JWT Bearer Authentication.

Roles:
- Admin
- User

---

# Coding Rules

## General

- Use async/await everywhere possible.
- Avoid duplicated logic.
- Use dependency injection.
- Keep methods small and readable.
- Prefer composition over inheritance.

---

## Naming

### Classes
PascalCase

### Variables
camelCase

### Interfaces
Prefix with `I`

Example:
```csharp
IMovieService
```

---

# DTO Rules

DTOs must NOT expose:
- PasswordHash
- Internal EF fields
- Sensitive information

---

# Repository Rules

Avoid generic repository overengineering.

Use EF Core directly when appropriate.

Only create repositories for:
- complex queries
- reusable query logic
- aggregate operations

---

# Performance Guidelines

- Use pagination for list endpoints.
- Avoid N+1 queries.
- Use projections instead of returning full entities.
- Use AsNoTracking() for read-only queries.

---

# Security Guidelines

- Never store plain passwords.
- Always validate JWT tokens.
- Validate request payloads.
- Use HTTPS in production.
- Protect admin endpoints with roles.

---

# Recommended Development Flow

1. Create Entity
2. Create Entity Configuration
3. Add DbSet to DbContext
4. Create Migration
5. Update Database
6. Create DTO
7. Create Service
8. Create Controller
9. Test API

---

# Frontend Integration

Frontend:
- Next.js App Router
- next-intl
- Tailwind CSS

API communication:
- REST API
- JSON responses
- JWT authentication

---

# Notes

- Keep architecture simple.
- Avoid unnecessary abstraction.
- Prefer clarity over cleverness.
- Build features incrementally.

