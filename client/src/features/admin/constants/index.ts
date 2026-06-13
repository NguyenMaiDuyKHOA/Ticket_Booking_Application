import { CalendarDays, ClipboardList, ListChecks, PackagePlus } from "lucide-react";

import type { AdminTab } from "../types/item.types";

export const adminTabs: Array<{ icon: typeof PackagePlus; id: AdminTab; labelKey: string }> = [
  { icon: PackagePlus, id: "add", labelKey: "tabs.add" },
  { icon: ListChecks, id: "list", labelKey: "tabs.list" },
  { icon: CalendarDays, id: "showtimes", labelKey: "tabs.showtimes" },
  { icon: ClipboardList, id: "orders", labelKey: "tabs.orders" },
];

export const orderRows = [
  { amount: "230.000 VND", code: "TB20260609001", customer: "0900000000", status: "Confirmed" },
  { amount: "690.000 VND", code: "TB20260609002", customer: "0911222333", status: "Pending" },
  { amount: "125.000 VND", code: "TB20260609003", customer: "0988777666", status: "Cancelled" },
];
