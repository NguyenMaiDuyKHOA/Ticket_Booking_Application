import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

import { orderRows } from "@/features/admin/constants";
import { AdminTable } from "./shared/AdminTable";

export function OrdersPanel() {
  const t = useTranslations("Admin");

  return (
    <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-black text-neutral-950">
        <CalendarDays className="h-5 w-5 text-red-700" aria-hidden="true" />
        {t("orders.heading")}
      </h2>
      <AdminTable
        headers={[t("orders.code"), t("orders.customer"), t("orders.amount"), t("orders.status")]}
        rows={orderRows.map((row) => [row.code, row.customer, row.amount, row.status])}
      />
    </section>
  );
}
