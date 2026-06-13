import { getCities } from "@/lib/cities-api";
import { getHalls } from "@/lib/halls-api";
import { getShowtimeStatuses } from "@/lib/showtime-statuses-api";
import { getVenues } from "@/lib/venues-api";

export const venueService = {
  getCities,
  getHalls,
  getShowtimeStatuses,
  getVenues,
};
