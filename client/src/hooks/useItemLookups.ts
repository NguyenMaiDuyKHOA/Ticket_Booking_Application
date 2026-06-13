import { useEffect, useState } from "react";

import type { CityOption } from "@/lib/cities-api";
import type { GenreOption } from "@/lib/genres-api";
import type { HallTypeOption } from "@/lib/hall-types-api";
import type { ItemStatusOption } from "@/lib/item-statuses-api";
import type { ItemTypeOption } from "@/lib/item-types-api";

import { itemService } from "@/features/admin/services/item.service";

export function useItemLookups(isEnabled: boolean) {
  const [managedTypes, setManagedTypes] = useState<ItemTypeOption[]>([]);
  const [managedType, setManagedType] = useState<ItemTypeOption | null>(null);
  const [itemStatuses, setItemStatuses] = useState<ItemStatusOption[]>([]);
  const [itemStatus, setItemStatus] = useState<ItemStatusOption | null>(null);
  const [genres, setGenres] = useState<GenreOption[]>([]);
  const [hallTypes, setHallTypes] = useState<HallTypeOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [itemTypesError, setItemTypesError] = useState<string | null>(null);
  const [itemStatusesError, setItemStatusesError] = useState<string | null>(null);
  const [genresError, setGenresError] = useState<string | null>(null);
  const [hallTypesError, setHallTypesError] = useState<string | null>(null);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [areItemTypesLoading, setAreItemTypesLoading] = useState(false);
  const [areItemStatusesLoading, setAreItemStatusesLoading] = useState(false);
  const [areGenresLoading, setAreGenresLoading] = useState(false);
  const [areHallTypesLoading, setAreHallTypesLoading] = useState(false);
  const [areCitiesLoading, setAreCitiesLoading] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isMounted = true;
    setAreItemTypesLoading(true);
    setAreItemStatusesLoading(true);
    setAreGenresLoading(true);
    setAreHallTypesLoading(true);
    setAreCitiesLoading(true);
    setItemTypesError(null);
    setItemStatusesError(null);
    setGenresError(null);
    setHallTypesError(null);
    setCitiesError(null);

    itemService
      .getItemTypes()
      .then((itemTypes) => {
        if (!isMounted) {
          return;
        }

        setManagedTypes(itemTypes);
        setManagedType((current) => current ?? itemTypes[0] ?? null);
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setItemTypesError(error instanceof Error ? error.message : "Unable to load item types.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setAreItemTypesLoading(false);
        }
      });

    itemService
      .getItemStatuses()
      .then((statuses) => {
        if (!isMounted) {
          return;
        }

        setItemStatuses(statuses);
        setItemStatus((current) => current ?? statuses.find((status) => status.slug === "draft") ?? statuses[0] ?? null);
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setItemStatusesError(error instanceof Error ? error.message : "Unable to load item statuses.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setAreItemStatusesLoading(false);
        }
      });

    itemService
      .getGenres()
      .then((genreOptions) => {
        if (isMounted) {
          setGenres(genreOptions);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setGenresError(error instanceof Error ? error.message : "Unable to load genres.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setAreGenresLoading(false);
        }
      });

    itemService
      .getHallTypes()
      .then((hallTypeOptions) => {
        if (isMounted) {
          setHallTypes(hallTypeOptions);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setHallTypesError(error instanceof Error ? error.message : "Unable to load hall types.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setAreHallTypesLoading(false);
        }
      });

    itemService
      .getCities()
      .then((cityOptions) => {
        if (isMounted) {
          setCities(cityOptions);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setCitiesError(error instanceof Error ? error.message : "Unable to load cities.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setAreCitiesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isEnabled]);

  return {
    areCitiesLoading,
    areGenresLoading,
    areHallTypesLoading,
    areItemStatusesLoading,
    areItemTypesLoading,
    cities,
    citiesError,
    genres,
    genresError,
    hallTypes,
    hallTypesError,
    itemStatus,
    itemStatuses,
    itemStatusesError,
    itemTypesError,
    managedType,
    managedTypes,
    setItemStatus,
    setManagedType,
  };
}
