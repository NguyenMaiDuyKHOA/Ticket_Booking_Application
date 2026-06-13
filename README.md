# 🎟️ Ticket Booking Application

A modern ticket booking platform that supports movies, concerts, sports events, workshops, theater performances, and other event types.

The system is built with a scalable architecture that separates content management, venue management, showtime scheduling, and ticket booking into independent modules.

---

## ✨ Features

### Public Features

* Browse available items
* View item details
* Search and filter content
* View showtimes
* View venue information
* Book tickets
* Responsive user interface
* Multi-language support (i18n)

### Admin Features

* Manage Items (Movies, Concerts, Sports, Workshops, etc.)
* Manage Genres
* Manage Venues
* Manage Halls
* Manage Showtimes
* Upload Posters and Images
* Rich Text Description Editor
* Dashboard Management

---

## 🏗️ Architecture

Backend follows Clean Architecture principles.

```text
server/
│
├── TicketBook.API
├── TicketBook.Application
├── TicketBook.Domain
├── TicketBook.Infrastructure
└── TicketBook.Persistence
```

### Domain

Contains:

* Entities
* Enums
* Value Objects
* Domain Rules

### Application

Contains:

* Use Cases
* DTOs
* Validators
* Interfaces
* Business Logic

### Infrastructure

Contains:

* External Services
* File Storage
* Authentication
* Email Services

### API

Contains:

* Controllers
* Middleware
* Dependency Injection
* API Configuration

---

## 📦 Core Entities

### Item

Represents any bookable content.

Examples:

* Movie
* Concert
* Sport Event
* Theater
* Workshop
* Exhibition

### Venue

Represents a physical location.

Examples:

* CGV Vincom Đồng Khởi
* Nhà Hát Hòa Bình
* SECC
* Mỹ Đình Stadium

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

## 🗄️ Database

Database:

```text
PostgreSQL
```

Relationships:

```text
Item
  └── Multiple Showtimes

Venue
  └── Multiple Halls

Hall
  └── Multiple Showtimes
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

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* i18next
* Lucide React

### Backend

* ASP.NET Core
* Entity Framework Core
* Clean Architecture
* JWT Authentication

### Database

* PostgreSQL

### Tools

* DBeaver
* Git
* GitHub
* VS Code

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/NguyenMaiDuyKHOA/Ticket_Booking_Application.git
```

### Backend Setup

```bash
cd server
dotnet restore
dotnet ef database update
dotnet run --project TicketBook.API
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## ⚙️ Environment Variables

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

## 📋 Roadmap

* [x] Item Management
* [x] Venue Management
* [x] Hall Management
* [x] Showtime Management
* [x] Multi-language Support
* [ ] Ticket Booking Flow
* [ ] Seat Selection
* [ ] Payment Integration
* [ ] Review & Rating System
* [ ] Analytics Dashboard
* [ ] Redis Caching
* [ ] Real-time Seat Availability

---

## 📄 License

This project is developed for learning, portfolio, and educational purposes.

---

## 👨‍💻 Author

**Khoa Duy**

GitHub: https://github.com/NguyenMaiDuyKHOA
