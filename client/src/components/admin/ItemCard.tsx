import type { ItemResponse } from "@/lib/items-api";

import { shortId } from "@/features/admin/utils/format";

type ItemCardProps = {
  item: ItemResponse;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="rounded-md border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-red-700">{item.itemTypeSlug}</p>
          <h3 className="mt-1 text-base font-black text-neutral-950">{item.title}</h3>
        </div>
        <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-black text-neutral-600">{shortId(item.id)}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-neutral-500">{item.itemStatusSlug}</p>
    </article>
  );
}
