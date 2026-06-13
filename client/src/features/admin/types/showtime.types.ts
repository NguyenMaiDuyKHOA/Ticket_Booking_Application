import type { CityOption } from "@/lib/cities-api";
import type { HallOption } from "@/lib/halls-api";
import type { ItemResponse } from "@/lib/items-api";
import type { ItemTypeOption } from "@/lib/item-types-api";
import type { ShowtimeStatusOption } from "@/lib/showtime-statuses-api";
import type { ShowtimeResponse } from "@/lib/showtimes-api";
import type { VenueOption } from "@/lib/venues-api";

export type ShowtimeFormState = {
  editingShowtimeId: string | null;
  endTime: string;
  price: string;
  selectedCityId: string;
  selectedHallId: string;
  selectedItemId: string;
  selectedItemTypeId: string;
  selectedListItemId: string;
  selectedStatusId: string;
  selectedVenueId: string;
  startTime: string;
};

export type ShowtimeManagerState = {
  cities: CityOption[];
  errorMessage: string | null;
  filteredCities: CityOption[];
  filteredHalls: HallOption[];
  filteredVenues: VenueOption[];
  form: ShowtimeFormState;
  halls: HallOption[];
  isLoading: boolean;
  isSaving: boolean;
  items: ItemResponse[];
  itemTypes: ItemTypeOption[];
  selectedItem: ItemResponse | null;
  selectedItemType: ItemTypeOption | null;
  filteredShowtimes: ShowtimeResponse[];
  showtimes: ShowtimeResponse[];
  statuses: ShowtimeStatusOption[];
  venues: VenueOption[];
};

export type ShowtimeFormActions = {
  cancelEdit: () => void;
  deleteShowtime: (showtimeId: string) => Promise<void>;
  editShowtime: (showtime: ShowtimeResponse) => void;
  saveShowtime: () => Promise<void>;
  setEndTime: (value: string) => void;
  setPrice: (value: string) => void;
  setSelectedCityId: (value: string) => void;
  setSelectedHallId: (value: string) => void;
  setSelectedItemId: (value: string) => void;
  setSelectedItemTypeId: (value: string) => void;
  setSelectedListItemId: (value: string) => void;
  setSelectedStatusId: (value: string) => void;
  setSelectedVenueId: (value: string) => void;
  setStartTime: (value: string) => void;
};
