"use client";

import { useEffect, useState } from "react";

import { EventCard } from "@/components/cards";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getItems, type ItemResponse } from "@/lib/items-api";

export function TourPage() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    getItems({ itemTypeSlug: "tour", page: 1, pageSize: 50 })
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

      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-black text-white">Tour</h1>

          {isLoading ? (
            <p className="mt-6 rounded-md bg-white px-3 py-2 text-sm font-bold text-neutral-500">Loading items from database...</p>
          ) : null}
          {errorMessage ? (
            <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{errorMessage}</p>
          ) : null}
          {!isLoading && !errorMessage && items.length === 0 ? (
            <p className="mt-6 rounded-md bg-white px-3 py-2 text-sm font-bold text-neutral-500">No tour items in the database yet.</p>
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
                  location={readString(metadata.location) || "-"}
                  badge={formatMoney(item.price)}
                  href={`/tour/${item.slug}`}
                />
              );
            })}
          </div>
        </section>
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
