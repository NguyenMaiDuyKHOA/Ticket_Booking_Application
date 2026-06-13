"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { cn } from "@/components/cards/card-utils";

import { getOrderItemTypeConfig } from "./order-item-registry";
import type { BookingItemRendererMap, OrderItemData } from "./types";

type BookingItemProps = {
  formatMoney: (amount: number) => string;
  item: OrderItemData;
  labels: {
    decreaseQuantity: string;
    increaseQuantity: string;
    removeItem?: string;
  };
  minQuantity?: number;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
  renderers?: BookingItemRendererMap;
};

// Renders one dynamic cart-style booking item using item_type config and composition.
export function BookingItem({
  formatMoney,
  item,
  labels,
  minQuantity = 0,
  onQuantityChange,
  onRemove,
  renderers,
}: BookingItemProps) {
  const typeConfig = getOrderItemTypeConfig(item.item_type);
  const TypeIcon = typeConfig.icon;
  const lineTotal = item.unitPrice * item.quantity;
  const canDecrease = item.quantity > minQuantity;
  const renderDetails = renderers?.[item.item_type] ?? typeConfig.renderDetails;

  return (
    <article className="grid gap-3 rounded-lg border border-black/10 bg-neutral-50 p-3 sm:grid-cols-[auto_1fr]">
      {item.image ? (
        <div className="relative h-20 w-16 overflow-hidden rounded-md bg-white">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="64px"
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      ) : null}

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className={cn(
                "mb-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-black",
                typeConfig.toneClassName,
              )}
            >
              <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {typeConfig.label}
            </div>
            <h4 className="line-clamp-2 text-sm font-black text-neutral-950">
              {item.title}
            </h4>
            {item.description ? (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-600">
                {item.description}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-neutral-950">
              {formatMoney(lineTotal)}
            </p>
            <p className="text-xs font-semibold text-neutral-500">
              {item.quantity} x {formatMoney(item.unitPrice)}
            </p>
          </div>
        </div>

        {renderDetails ? (
          <div className="mt-3">{renderDetails(item)}</div>
        ) : item.metadata?.length ? (
          <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
            {item.metadata.map((meta) => (
              <div key={`${item.id}-${meta.label}`} className="min-w-0">
                <dt className="font-bold uppercase tracking-wide text-neutral-500">
                  {meta.label}
                </dt>
                <dd className="truncate font-black text-neutral-800">
                  {meta.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {onQuantityChange && item.quantityEditable ? (
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                disabled={!canDecrease}
                aria-label={labels.decreaseQuantity}
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="grid h-8 w-8 place-items-center rounded-md border border-black/10 bg-white text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-6 text-center text-sm font-black text-neutral-950">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label={labels.increaseQuantity}
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="grid h-8 w-8 place-items-center rounded-md border border-black/10 bg-white text-neutral-700 transition hover:bg-neutral-100"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {onRemove ? (
            <button
              type="button"
              aria-label={labels.removeItem ?? "Remove item"}
              onClick={() => onRemove(item.id)}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-black/10 bg-white px-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              {labels.removeItem ?? "Remove"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
