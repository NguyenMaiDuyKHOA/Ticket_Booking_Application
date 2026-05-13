Thiết kế hệ thống multilingual cho entity Movie trong ASP.NET Core Web API sử dụng EF Core + PostgreSQL.

Yêu cầu:
- Không lưu title_vi/title_en trực tiếp trong bảng movies.
- Sử dụng translation table pattern.

Tạo:
1. Entity Movie
2. Entity MovieTranslation
3. Fluent API configuration
4. DbContext configuration
5. Migration
6. Repository/query example
7. DTO response

Yêu cầu database design:

Table: movies
- id (uuid)
- duration
- release_date
- poster_url
- created_at

Table: movie_translations
- id (uuid)
- movie_id (FK -> movies.id)
- locale (vi, en, etc)
- title
- description

Rules:
- Một movie có nhiều translation
- locale phải unique theo movie
  => unique(movie_id, locale)
- Cascade delete translations khi xóa movie
- Sử dụng navigation properties đầy đủ

Yêu cầu EF Core:
- Dùng IEntityTypeConfiguration
- Tách riêng configuration files
- Sử dụng HasMany / WithOne
- Sử dụng UseSnakeCaseNamingConvention cho PostgreSQL

Yêu cầu API:
- GET /movies?locale=vi
  => trả về translation đúng locale
- Nếu không có locale requested thì fallback sang "en"

Response mẫu:
{
  "id": "...",
  "title": "...",
  "description": "...",
  "duration": 120
}

Yêu cầu thêm:
- Seed sample data cho vi và en
- Tối ưu query bằng projection
- Không dùng Include nếu không cần
- Viết example LINQ query tốt cho EF Core

Project structure:
- Domain/Entities
- Infrastructure/Configurations
- Application/DTOs
- Application/Interfaces
- Infrastructure/Repositories

Sử dụng clean architecture.