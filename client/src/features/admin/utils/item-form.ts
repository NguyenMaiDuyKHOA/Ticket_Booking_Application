import type { CinemaMetadata, EventMetadata } from "../types/item.types";
import type { HallTypeOption } from "@/lib/hall-types-api";

export function buildMetadataJson(
  itemTypeSlug: string | undefined,
  cinemaMetadata: CinemaMetadata,
  eventMetadata: EventMetadata,
  genericMetadata: string,
  hallTypes: HallTypeOption[] = [],
) {
  if (itemTypeSlug === "cinema") {
    const selectedHallTypes = hallTypes.filter((hallType) => cinemaMetadata.supportedHallTypeIds.includes(hallType.id));

    return JSON.stringify(
      {
        ageRating: cinemaMetadata.ageRating,
        duration: cinemaMetadata.duration,
        format: selectedHallTypes.map((hallType) => hallType.name).join(", "),
        score: 10,
        supportedHallTypeIds: cinemaMetadata.supportedHallTypeIds,
      },
      null,
      2,
    );
  }

  if (itemTypeSlug === "event") {
    return JSON.stringify(
      {
        cityId: eventMetadata.cityId,
        detailLocation: eventMetadata.detailLocation,
      },
      null,
      2,
    );
  }

  return normalizeGenericMetadata(genericMetadata);
}

export function normalizeGenericMetadata(metadata: string) {
  try {
    return JSON.stringify(JSON.parse(metadata || "{}"), null, 2);
  } catch {
    return "{}";
  }
}

export function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeNonNegativeNumberInput(value: string) {
  if (value === "") {
    return "";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return value;
  }

  // Price is a business value; rejecting negative client state gives faster feedback before API validation.
  return numericValue < 0 ? "0" : value;
}

export function getNonNegativePrice(value: string) {
  const numericValue = Number(value || 0);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return Math.max(0, numericValue);
}

export function isRichTextEmpty(html: string) {
  const textContent = html
    .replace(/<img\b[^>]*>/gi, " image ")
    .replace(/<table\b[^>]*>/gi, " table ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();

  return textContent.length === 0;
}

export function revokeObjectUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function isValidJsonObject(metadata: string) {
  try {
    const parsedMetadata = JSON.parse(metadata || "{}");
    return parsedMetadata !== null && !Array.isArray(parsedMetadata) && typeof parsedMetadata === "object";
  } catch {
    return false;
  }
}
