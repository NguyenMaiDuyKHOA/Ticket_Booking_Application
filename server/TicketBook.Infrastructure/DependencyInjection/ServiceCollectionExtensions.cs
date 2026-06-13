using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TicketBook.Application.Interfaces;
using TicketBook.Infrastructure.Persistence;
using TicketBook.Infrastructure.Services;

namespace TicketBook.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is missing.");

        var jwtSection = configuration.GetSection(JwtOptions.SectionName);
        services.Configure<JwtOptions>(options =>
        {
            options.Issuer = jwtSection["Issuer"] ?? string.Empty;
            options.Audience = jwtSection["Audience"] ?? string.Empty;
            options.Secret = jwtSection["Secret"] ?? string.Empty;
            options.ExpirationMinutes = int.TryParse(jwtSection["ExpirationMinutes"], out var expirationMinutes)
                ? expirationMinutes
                : 60;
        });

        var cloudinarySection = configuration.GetSection(CloudinaryOptions.SectionName);
        services.Configure<CloudinaryOptions>(options =>
        {
            options.CloudName = cloudinarySection["CloudName"] ?? string.Empty;
            options.ApiKey = cloudinarySection["ApiKey"] ?? string.Empty;
            options.ApiSecret = cloudinarySection["ApiSecret"] ?? string.Empty;
            options.Folder = cloudinarySection["Folder"] ?? "ticketbook";
            options.MaxFileSizeBytes = long.TryParse(cloudinarySection["MaxFileSizeBytes"], out var maxFileSizeBytes)
                ? maxFileSizeBytes
                : 10 * 1024 * 1024;

            var allowedContentTypes = cloudinarySection
                .GetSection("AllowedContentTypes")
                .GetChildren()
                .Select(child => child.Value)
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Select(value => value!)
                .ToArray();

            if (allowedContentTypes.Length > 0)
            {
                options.AllowedContentTypes = allowedContentTypes;
            }
        });

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IImageStorageService, CloudinaryImageStorageService>();
        services.AddScoped<ICityService, CityService>();
        services.AddScoped<IGenreService, GenreService>();
        services.AddScoped<IItemService, ItemService>();
        services.AddScoped<IItemStatusService, ItemStatusService>();
        services.AddScoped<IItemTypeService, ItemTypeService>();
        services.AddScoped<IVenueService, VenueService>();
        services.AddScoped<IHallTypeService, HallTypeService>();
        services.AddScoped<IHallService, HallService>();
        services.AddScoped<IShowtimeStatusService, ShowtimeStatusService>();
        services.AddScoped<IShowtimeService, ShowtimeService>();
        services.AddScoped<IBookingService, BookingService>();

        return services;
    }
}
