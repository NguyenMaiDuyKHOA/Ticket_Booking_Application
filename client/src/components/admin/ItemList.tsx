import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { useItems } from "@/hooks/useItems";
import { shortId } from "@/features/admin/utils/format";
import type { ItemResponse } from "@/lib/items-api";
import { AdminTable } from "./shared/AdminTable";
import { AdminSelect } from "./shared/AdminSelect";

export function ItemList() {
  const t = useTranslations("Admin");
  const { errorMessage, isLoading, items, itemTypes, selectedItemType, selectedItemTypeId, setSelectedItemTypeId } = useItems();
  const tableHeaders = [t("list.id"), t("list.title"), t("list.type"), t("list.status"), t("list.showtimeCount")];
  const groupedItems = useMemo(
    () =>
      itemTypes
        .map((itemType) => ({
          itemType,
          items: items.filter((item) => item.itemTypeId === itemType.id),
        }))
        .filter((group) => group.items.length > 0),
    [items, itemTypes],
  );

  return (
    <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-950">{t("list.heading")}</h2>
          {selectedItemType ? <p className="mt-1 text-sm font-semibold text-neutral-500">{selectedItemType.name}</p> : null}
        </div>
        <div className="min-w-56 text-neutral-600">
          <AdminSelect label={t("fields.itemType")} value={selectedItemTypeId} onChange={(event) => setSelectedItemTypeId(event.target.value)}>
            <option value="">All item types</option>
            {itemTypes.map((itemType) => (
              <option key={itemType.id} value={itemType.id}>
                {itemType.name}
              </option>
            ))}
          </AdminSelect>
        </div>
      </div>
      {isLoading ? (
        <p className="mt-4 rounded-md bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-500">{t("list.loading")}</p>
      ) : null}
      {errorMessage ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{errorMessage}</p>
      ) : null}
      {!isLoading && !errorMessage && items.length === 0 ? (
        <p className="mt-4 rounded-md bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-500">{t("list.empty")}</p>
      ) : null}
      {!isLoading && !errorMessage && items.length > 0 ? (
        selectedItemType ? (
          <AdminTable headers={tableHeaders} rows={toRows(items)} />
        ) : (
          <div className="mt-5 grid gap-6">
            {groupedItems.map((group) => (
              <section key={group.itemType.id}>
                <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-2">
                  <h3 className="text-sm font-black uppercase tracking-wide text-red-700">{group.itemType.name}</h3>
                  <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-black text-neutral-500">{group.items.length}</span>
                </div>
                <AdminTable headers={tableHeaders} rows={toRows(group.items)} />
              </section>
            ))}
          </div>
        )
      ) : null}
    </section>
  );
}

function toRows(items: ItemResponse[]) {
  return items.map((item) => [shortId(item.id), item.title, item.itemTypeSlug, item.itemStatusSlug, String(item.showtimeCount)]);
}
