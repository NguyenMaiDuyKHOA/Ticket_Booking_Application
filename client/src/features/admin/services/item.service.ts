import { getCities } from "@/lib/cities-api";
import { getGenres } from "@/lib/genres-api";
import { getHallTypes } from "@/lib/hall-types-api";
import { createItem, getItems } from "@/lib/items-api";
import { getItemStatuses } from "@/lib/item-statuses-api";
import { getItemTypes } from "@/lib/item-types-api";
import { uploadImage } from "@/lib/uploads-api";

export const itemService = {
  createItem,
  getCities,
  getGenres,
  getHallTypes,
  getItems,
  getItemStatuses,
  getItemTypes,
  uploadImage,
};
