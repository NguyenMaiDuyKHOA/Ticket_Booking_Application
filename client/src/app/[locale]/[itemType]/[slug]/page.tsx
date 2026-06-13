import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { ItemDetailPage, type ItemDetail, type ItemType } from "@/features/item-detail";
import { getCities, type CityOption } from "@/lib/cities-api";
import { getItemById, getItemBySlug, type ItemResponse } from "@/lib/items-api";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: {
    slug: string;
    itemType: string;
    locale: Locale;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const routeItem = await getRouteItem(params);

  if (!routeItem) {
    return {};
  }

  return {
    title: `${routeItem.item.title} | TicketPro`,
    description: routeItem.item.subtitle,
  };
}

// Routes every supported item type to the shared detail feature using catalog data from the API.
export default async function ItemDetailRoute({ params }: Props) {
  setRequestLocale(params.locale);

  const routeItem = await getRouteItem(params);

  if (!routeItem) {
    notFound();
  }

  if (routeItem.shouldRedirectToSlug) {
    redirect(`/${params.locale}/${routeItem.item.type}/${routeItem.slug}`);
  }

  return <ItemDetailPage item={routeItem.item} />;
}

async function getRouteItem(params: Props["params"]): Promise<{ item: ItemDetail; shouldRedirectToSlug: boolean; slug: string } | null> {
  try {
    const [item, cities] = await Promise.all([
      getItemByPublicIdentifier(params.slug),
      getCities(),
    ]);
    const routeType = toRouteItemType(item.itemTypeSlug);

    if (!routeType || routeType !== params.itemType) {
      return null;
    }

    return {
      item: toItemDetail(item, routeType, params.locale, cities),
      shouldRedirectToSlug: item.slug !== params.slug,
      slug: item.slug,
    };
  } catch {
    return null;
  }
}

async function getItemByPublicIdentifier(value: string): Promise<ItemResponse> {
  try {
    return await getItemBySlug(value);
  } catch (error) {
    // Keep old GUID URLs from breaking after the public route moved to slugs.
    if (isGuid(value)) {
      return getItemById(value);
    }

    throw error;
  }
}

function isGuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toRouteItemType(itemTypeSlug: string): ItemType | null {
  if (itemTypeSlug === "cinema") {
    return "cgv";
  }

  if (itemTypeSlug === "event" || itemTypeSlug === "concert" || itemTypeSlug === "tour") {
    return itemTypeSlug;
  }

  return null;
}

function toItemDetail(item: ItemResponse, type: ItemType, locale: Locale, cities: CityOption[]): ItemDetail {
  const metadata = parseItemMetadata(item.metadata);
  const genres = item.genres.map((itemGenre) => itemGenre.slug);
  const subtitle = item.genres.map((itemGenre) => itemGenre.name).join(", ") || item.itemTypeSlug;
  const duration = formatDuration(metadata.duration);
  const format = readString(metadata.format);
  const displayFormat = type === "cgv" ? format : undefined;
  const location = formatLocation(metadata, cities);
  const ageRating = readString(metadata.ageRating);
  const score = readNumber(metadata.score);
  const startDate = formatDate(item.startDate, locale);

  return {
    id: item.id,
    type,
    title: item.title,
    subtitle,
    summary: item.description,
    genres,
    duration,
    age: ageRating,
    format: displayFormat,
    location,
    score: score ? String(score) : "10",
    startDate,
    priceLabel: formatMoney(item.price, locale),
    image: item.posterUrl || item.imageUrl || "/Poster/Perfume_poster.jpg",
    ctaHref: `/${type}`,
    facts: [
      ...(ageRating ? [{ label: "ageRating", value: ageRating }] : []),
      ...(startDate ? [{ label: "startDate", value: startDate }] : []),
      ...(duration ? [{ label: "duration", value: duration }] : []),
      ...(displayFormat ? [{ label: "displayFormat", value: displayFormat }] : []),
      ...(location ? [{ label: "location", value: location }] : []),
    ],
  };
}

function formatLocation(metadata: Record<string, unknown>, cities: CityOption[]) {
  const cityId = readString(metadata.cityId);
  const detailLocation = readString(metadata.detailLocation);
  const cityName = cities.find((city) => city.id === cityId)?.name ?? "";

  return [detailLocation, cityName].filter(Boolean).join(", ") || readString(metadata.location);
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

function formatDate(value: string, locale: Locale) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value || undefined;
  }

  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
