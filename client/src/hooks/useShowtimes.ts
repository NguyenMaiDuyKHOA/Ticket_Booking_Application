import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/toast";
import type { CityOption } from "@/lib/cities-api";
import type { HallOption } from "@/lib/halls-api";
import type { ItemResponse } from "@/lib/items-api";
import type { ItemTypeOption } from "@/lib/item-types-api";
import type { ShowtimeStatusOption } from "@/lib/showtime-statuses-api";
import type { ShowtimeResponse } from "@/lib/showtimes-api";
import type { VenueOption } from "@/lib/venues-api";

import { itemService } from "@/features/admin/services/item.service";
import { showtimeService } from "@/features/admin/services/showtime.service";
import { venueService } from "@/features/admin/services/venue.service";
import { toApiDateTimeOffset, toDateTimeLocalValue } from "@/features/admin/utils/format";
import { normalizeNonNegativeNumberInput } from "@/features/admin/utils/item-form";

export function useShowtimes() {
  const t = useTranslations("Admin");
  const { showToast } = useToast();
  const [itemTypes, setItemTypes] = useState<ItemTypeOption[]>([]);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [halls, setHalls] = useState<HallOption[]>([]);
  const [statuses, setStatuses] = useState<ShowtimeStatusOption[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeResponse[]>([]);
  const [selectedItemTypeId, setSelectedItemTypeId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedListItemId, setSelectedListItemId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [selectedHallId, setSelectedHallId] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [editingShowtimeId, setEditingShowtimeId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedItemType = useMemo(
    () => itemTypes.find((itemType) => itemType.id === selectedItemTypeId) ?? null,
    [itemTypes, selectedItemTypeId],
  );
  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  const filteredShowtimes = useMemo(
    () => showtimes.filter((showtime) => !selectedListItemId || showtime.itemId === selectedListItemId),
    [selectedListItemId, showtimes],
  );

  const filteredCities = useMemo(() => cities, [cities]);

  const venuesById = useMemo(() => new Map(venues.map((venue) => [venue.id, venue])), [venues]);

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => !selectedCityId || venue.cityId === selectedCityId);
  }, [selectedCityId, venues]);

  const filteredHalls = useMemo(
    () =>
      halls.filter((hall) => {
        const venue = venuesById.get(hall.venueId);

        return (
          hall.venueId === selectedVenueId &&
          (!selectedItemTypeId || hall.itemTypeId === selectedItemTypeId) &&
          (!selectedCityId || venue?.cityId === selectedCityId)
        );
      }),
    [halls, selectedCityId, selectedItemTypeId, selectedVenueId, venuesById],
  );

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    Promise.all([
      itemService.getItemTypes(),
      venueService.getCities(),
      venueService.getVenues(),
      venueService.getShowtimeStatuses(),
    ])
      .then(([typeOptions, cityOptions, venueOptions, statusOptions]) => {
        if (!isMounted) {
          return;
        }

        setItemTypes(typeOptions);
        setCities(cityOptions);
        setVenues(venueOptions);
        setStatuses(statusOptions);
        setSelectedItemTypeId((current) => current || typeOptions[0]?.id || "");
        setSelectedCityId((current) => current || cityOptions[0]?.id || "");
        setSelectedStatusId((current) => current || statusOptions.find((status) => status.slug === "scheduled")?.id || statusOptions[0]?.id || "");
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load showtime setup data.");
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

  useEffect(() => {
    if (!selectedItemTypeId || itemTypes.length === 0) {
      return;
    }

    const itemType = itemTypes.find((candidate) => candidate.id === selectedItemTypeId);
    if (!itemType) {
      return;
    }

    let isMounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    Promise.all([
      itemService.getItems({ itemTypeSlug: itemType.slug, page: 1, pageSize: 100 }),
      venueService.getHalls(undefined, selectedItemTypeId),
      showtimeService.getShowtimes({ itemTypeId: selectedItemTypeId, page: 1, pageSize: 100 }),
    ])
      .then(([itemResult, hallOptions, showtimeResult]) => {
        if (!isMounted) {
          return;
        }

        setItems(itemResult.items);
        setHalls(hallOptions);
        setShowtimes(showtimeResult.items);
        setSelectedItemId((current) => (itemResult.items.some((item) => item.id === current) ? current : itemResult.items[0]?.id || ""));
        setSelectedListItemId((current) => (itemResult.items.some((item) => item.id === current) ? current : ""));
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load showtimes.");
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
  }, [itemTypes, selectedItemTypeId]);

  useEffect(() => {
    if (selectedCityId && cities.some((city) => city.id === selectedCityId)) {
      return;
    }

    setSelectedCityId(cities[0]?.id ?? "");
  }, [cities, selectedCityId]);

  useEffect(() => {
    if (selectedVenueId && filteredVenues.some((venue) => venue.id === selectedVenueId)) {
      return;
    }

    setSelectedVenueId(filteredVenues[0]?.id ?? "");
  }, [filteredVenues, selectedVenueId]);

  useEffect(() => {
    if (selectedHallId && filteredHalls.some((hall) => hall.id === selectedHallId)) {
      return;
    }

    setSelectedHallId(filteredHalls[0]?.id ?? "");
  }, [filteredHalls, selectedHallId]);

  function resetShowtimeForm() {
    setEditingShowtimeId(null);
    setStartTime("");
    setEndTime("");
    setPrice("");
    setSelectedStatusId(statuses.find((status) => status.slug === "scheduled")?.id || statuses[0]?.id || "");
  }

  function changeSelectedItemType(itemTypeId: string) {
    setSelectedItemTypeId(itemTypeId);
    setSelectedItemId("");
    setSelectedListItemId("");
    setSelectedVenueId("");
    setSelectedHallId("");
    resetShowtimeForm();
  }

  function changeSelectedCity(cityId: string) {
    setSelectedCityId(cityId);
    setSelectedVenueId("");
    setSelectedHallId("");
  }

  function editShowtime(showtime: ShowtimeResponse) {
    const venue = venues.find((candidate) => candidate.id === showtime.venueId);

    setEditingShowtimeId(showtime.id);
    setSelectedItemTypeId(showtime.itemTypeId);
    setSelectedItemId(showtime.itemId);
    setSelectedCityId(venue?.cityId ?? "");
    setSelectedVenueId(showtime.venueId);
    setSelectedHallId(showtime.hallId);
    setSelectedStatusId(showtime.showtimeStatusId);
    setStartTime(toDateTimeLocalValue(showtime.startTime));
    setEndTime(toDateTimeLocalValue(showtime.endTime));
    setPrice(String(showtime.price));
  }

  async function refreshShowtimes(itemTypeId = selectedItemTypeId) {
    if (!itemTypeId) {
      setShowtimes([]);
      return;
    }

    const result = await showtimeService.getShowtimes({ itemTypeId, page: 1, pageSize: 100 });
    setShowtimes(result.items);
  }

  async function saveShowtime() {
    if (!selectedItemTypeId || !selectedItemId || !selectedCityId || !selectedHallId || !startTime || !endTime) {
      showToast({ message: "Item type, item, city, hall, start time and end time are required.", type: "error" });
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      showToast({ message: "Start time must be earlier than end time.", type: "error" });
      return;
    }

    const numericPrice = Number(price || 0);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      showToast({ message: t("errors.priceNonNegative"), type: "error" });
      return;
    }

    const request = {
      endTime: toApiDateTimeOffset(endTime),
      hallId: selectedHallId,
      itemId: selectedItemId,
      price: numericPrice,
      showtimeStatusId: selectedStatusId || null,
      startTime: toApiDateTimeOffset(startTime),
    };

    try {
      setIsSaving(true);
      if (editingShowtimeId) {
        await showtimeService.updateShowtime(editingShowtimeId, request);
        showToast({ message: "Showtime updated.", type: "success" });
      } else {
        await showtimeService.createShowtime(request);
        showToast({ message: "Showtime created.", type: "success" });
      }

      resetShowtimeForm();
      await refreshShowtimes(selectedItemTypeId);
    } catch (error) {
      showToast({ message: error instanceof Error ? error.message : "Unable to save showtime.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteShowtime(showtimeId: string) {
    if (!window.confirm("Delete this showtime?")) {
      return;
    }

    try {
      await showtimeService.deleteShowtime(showtimeId);
      showToast({ message: "Showtime deleted.", type: "success" });
      await refreshShowtimes();
    } catch (error) {
      showToast({ message: error instanceof Error ? error.message : "Unable to delete showtime.", type: "error" });
    }
  }

  return {
    actions: {
      cancelEdit: resetShowtimeForm,
      deleteShowtime,
      editShowtime,
      saveShowtime,
      setEndTime,
      setPrice: (value: string) => setPrice(normalizeNonNegativeNumberInput(value)),
      setSelectedCityId: changeSelectedCity,
      setSelectedHallId,
      setSelectedItemId,
      setSelectedItemTypeId: changeSelectedItemType,
      setSelectedListItemId,
      setSelectedStatusId,
      setSelectedVenueId,
      setStartTime,
    },
    state: {
      cities,
      errorMessage,
      filteredCities,
      filteredHalls,
      filteredVenues,
      form: {
        editingShowtimeId,
        endTime,
        price,
        selectedCityId,
        selectedHallId,
        selectedItemId,
        selectedItemTypeId,
        selectedListItemId,
        selectedStatusId,
        selectedVenueId,
        startTime,
      },
      halls,
      isLoading,
      isSaving,
      items,
      itemTypes,
      selectedItem,
      selectedItemType,
      filteredShowtimes,
      showtimes,
      statuses,
      venues,
    },
  };
}
