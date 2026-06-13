import type { CityOption } from "@/lib/cities-api";
import type { GenreOption } from "@/lib/genres-api";
import type { HallTypeOption } from "@/lib/hall-types-api";
import type { ItemResponse } from "@/lib/items-api";
import type { ItemStatusOption } from "@/lib/item-statuses-api";
import type { ItemTypeOption } from "@/lib/item-types-api";

export type AdminTab = "add" | "list" | "showtimes" | "orders";

export type AgeRating = "P" | "K" | "T13" | "T16" | "T18";

export type CinemaMetadata = {
  ageRating: AgeRating;
  duration: string;
  format: string;
  supportedHallTypeIds: string[];
};

export type EventMetadata = {
  cityId: string;
  detailLocation: string;
};

export type ItemLookupState = {
  areCitiesLoading: boolean;
  areGenresLoading: boolean;
  areHallTypesLoading: boolean;
  areItemStatusesLoading: boolean;
  areItemTypesLoading: boolean;
  cities: CityOption[];
  citiesError: string | null;
  genres: GenreOption[];
  genresError: string | null;
  hallTypes: HallTypeOption[];
  hallTypesError: string | null;
  itemStatus: ItemStatusOption | null;
  itemStatuses: ItemStatusOption[];
  itemStatusesError: string | null;
  itemTypesError: string | null;
  managedType: ItemTypeOption | null;
  managedTypes: ItemTypeOption[];
  setItemStatus: (status: ItemStatusOption) => void;
  setManagedType: (type: ItemTypeOption) => void;
};

export type ItemListState = {
  errorMessage: string | null;
  isLoading: boolean;
  items: ItemResponse[];
};
