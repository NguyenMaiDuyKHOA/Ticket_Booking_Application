import { useMemo, useState } from "react";

import type { CinemaMetadata, EventMetadata } from "@/features/admin/types/item.types";
import type { HallTypeOption } from "@/lib/hall-types-api";
import { buildMetadataJson } from "@/features/admin/utils/item-form";

export function useMetadata(itemTypeSlug: string | undefined, hallTypes: HallTypeOption[] = []) {
  const [cinemaMetadata, setCinemaMetadata] = useState<CinemaMetadata>({
    ageRating: "P",
    duration: "",
    format: "",
    supportedHallTypeIds: [],
  });
  const [eventMetadata, setEventMetadata] = useState<EventMetadata>({
    cityId: "",
    detailLocation: "",
  });
  const [genericMetadata, setGenericMetadata] = useState("{}");

  const metadataJson = useMemo(
    () => buildMetadataJson(itemTypeSlug, cinemaMetadata, eventMetadata, genericMetadata, hallTypes),
    [cinemaMetadata, eventMetadata, genericMetadata, hallTypes, itemTypeSlug],
  );

  function resetMetadata() {
    setCinemaMetadata({ ageRating: "P", duration: "", format: "", supportedHallTypeIds: [] });
    setEventMetadata({ cityId: "", detailLocation: "" });
    setGenericMetadata("{}");
  }

  return {
    eventMetadata,
    cinemaMetadata,
    genericMetadata,
    metadataJson,
    resetMetadata,
    setCinemaMetadata,
    setEventMetadata,
    setGenericMetadata,
  };
}
