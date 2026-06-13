"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { FeatureBanner } from "@/components/banner";
import { MovieCard } from "@/components/cards/movie-card";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Rank } from "@/components/rank";
import { Searchbar } from "@/components/searchbar";
import { getItems, type ItemResponse } from "@/lib/items-api";

import { banners } from "@/features/cgv/banner-data";

// Renders the CGV page with real catalog items. Booking is disabled until the Showtime/Seat flow is wired to the API.
export function BookingExperience() {
  const t = useTranslations("Booking");
  const t1 = useTranslations("ItemDetail");
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedBanner =
    banners.find((banner) => banner.id === "movie-1") ?? banners[0];

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    getItems({ itemTypeSlug: "cinema", page: 1, pageSize: 50 })
      .then((result) => {
        if (isMounted) {
          setItems(result.items);
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
        <FeatureBanner type="movie" item={selectedBanner} />
        <Searchbar variant="cgv" />

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <section id="movies" className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-neutral-950">
                  {t("movies.title")}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {t("movies.subtitle")}
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="mt-5 rounded-md bg-white px-3 py-2 text-sm font-bold text-neutral-500">Loading items from database...</p>
            ) : null}
            {errorMessage ? (
              <p className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{errorMessage}</p>
            ) : null}
            {!isLoading && !errorMessage && items.length === 0 ? (
              <p className="mt-5 rounded-md bg-white px-3 py-2 text-sm font-bold text-neutral-500">No cinema items in the database yet.</p>
            ) : null}

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {items.map((item) => {
                const metadata = parseItemMetadata(item.metadata);
                const genreLine = item.genres.map((genre) => t1(`genres.${genre.slug}`)).join(", ") || item.description;

                return (
                  <MovieCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.posterUrl || item.imageUrl || "/Poster/Perfume_poster.jpg"}
                    description={genreLine}
                    duration={formatDuration(metadata.duration)}
                    startDate={formatDate(item.startDate)}
                    score={readNumber(metadata.score)}
                    badge={readString(metadata.format)}
                    href={`/cgv/${item.slug}`}
                    ageRating={readString(metadata.ageRating)}
                  />
                );
              })}
            </div>
          </section>

          <div className="grid gap-4 lg:self-start">
            <Rank type="cgv" />
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

function readNumber(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

function formatDuration(value: unknown) {
  return typeof value === "number" && value > 0 ? `${value}m` : undefined;
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value || undefined;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
