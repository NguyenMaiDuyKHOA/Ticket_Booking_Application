import { CalendarDays, Film, Map, Music2, Package, Ticket } from "lucide-react";

import type { OrderItemTypeConfig } from "./types";

export const defaultOrderItemTypeConfig: OrderItemTypeConfig = {
  icon: Ticket,
  label: "Ticket",
  toneClassName: "bg-neutral-100 text-neutral-700",
};

export const orderItemTypeConfig: Record<string, OrderItemTypeConfig> = {
  add_on: {
    icon: Package,
    label: "Add-on",
    toneClassName: "bg-amber-50 text-amber-800",
  },
  concert: {
    icon: Music2,
    label: "Concert",
    toneClassName: "bg-amber-50 text-amber-800",
  },
  event: {
    icon: CalendarDays,
    label: "Event",
    toneClassName: "bg-teal-50 text-teal-800",
  },
  movie: {
    icon: Film,
    label: "Movie",
    toneClassName: "bg-red-50 text-red-800",
  },
  tour: {
    icon: Map,
    label: "Tour",
    toneClassName: "bg-blue-50 text-blue-800",
  },
};

// Resolves item_type display config without branching inside checkout components.
export function getOrderItemTypeConfig(itemType: string) {
  return orderItemTypeConfig[itemType] ?? defaultOrderItemTypeConfig;
}
