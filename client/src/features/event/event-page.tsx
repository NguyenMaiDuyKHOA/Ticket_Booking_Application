"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { FeatureBanner } from "@/components/banner";
import { EventCard } from "@/components/cards";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Searchbar } from "@/components/searchbar";
import { banners } from "@/features/cgv/banner-data";
import { getCities, type CityOption } from "@/lib/cities-api";
import { getItems, type ItemResponse } from "@/lib/items-api";

export function EventPage() {
  const t = useTranslations("Booking");
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedBanner = banners.find((banner) => banner.id === "event-1") ?? banners[0];

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    Promise.all([
      getItems({ itemTypeSlug: "event", page: 1, pageSize: 50 }),
      getCities(),
    ])
      .then(([result, cityOptions]) => {
        if (isMounted) {
          setItems(result.items);
          setCities(cityOptions);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load items.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground">
        <FeatureBanner type="event" item={selectedBanner} />
        <Searchbar variant="event" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="text-white">
              <h2 className="text-2xl font-black">{t("movies.title")}</h2>
              <p className="mt-1 text-sm text-white/70">{t("movies.subtitle")}</p>
            </div>
          </div>

          {isLoading ? (
            <p className="mt-6 rounded-md bg-white px-3 py-2 text-sm font-bold text-neutral-500">Loading items from database...</p>
          ) : null}
          {errorMessage ? (
            <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{errorMessage}</p>
          ) : null}
          {!isLoading && !errorMessage && items.length === 0 ? (
            <p className="mt-6 rounded-md bg-white px-3 py-2 text-sm font-bold text-neutral-500">No event items in the database yet.</p>
          ) : null}

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const metadata = parseItemMetadata(item.metadata);

              return (
                <EventCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  image={item.imageUrl || item.posterUrl || "/Poster/Perfume_poster.jpg"}
                  eventType={item.genres[0]?.name ?? item.itemTypeSlug}
                  date={formatDate(item.startDate)}
                  location={formatEventLocation(metadata, cities)}
                  badge={formatMoney(item.price)}
                  href={`/event/${item.slug}`}
                />
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function parseItemMetadata(metadata: string) {
  try {
    const value = JSON.parse(metadata || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function formatEventLocation(metadata: Record<string, unknown>, cities: CityOption[]) {
  const cityId = readString(metadata.cityId);
  const cityName = cities.find((city) => city.id === cityId)?.name ?? "";

  // Cards should stay compact. The full street address belongs on the detail page.
  return cityName || inferCityName(readString(metadata.location), cities) || "-";
}

function inferCityName(location: string, cities: CityOption[]) {
  const normalizedLocation = location.toLocaleLowerCase("vi-VN");

  return cities.find((city) => normalizedLocation.includes(city.name.toLocaleLowerCase("vi-VN")))?.name ?? "";
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value || "-";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
