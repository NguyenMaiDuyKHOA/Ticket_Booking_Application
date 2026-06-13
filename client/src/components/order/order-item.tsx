"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/components/cards/card-utils";

import { getOrderItemTypeConfig } from "./order-item-registry";
import type { OrderItemData } from "./types";

type OrderItemProps = {
  decreaseLabel?: string;
  formatMoney: (amount: number) => string;
  increaseLabel?: string;
  item: OrderItemData;
  minQuantity?: number;
  onQuantityChange?: (itemId: string, quantity: number) => void;
};

// Renders a single line item for any item_type using data-provided metadata.
export function OrderItem({
  decreaseLabel = "Decrease quantity",
  formatMoney,
  increaseLabel = "Increase quantity",
  item,
  minQuantity = 0,
  onQuantityChange,
}: OrderItemProps) {
  const typeConfig = getOrderItemTypeConfig(item.item_type);
  const TypeIcon = typeConfig.icon;
  const lineTotal = item.unitPrice * item.quantity;
  const canDecrease = item.quantity > minQuantity;

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

        {item.metadata?.length ? (
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

        {onQuantityChange && item.quantityEditable ? (
          <div className="mt-3 inline-flex items-center gap-2">
            <button
              type="button"
              disabled={!canDecrease}
              aria-label={decreaseLabel}
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
              aria-label={increaseLabel}
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="grid h-8 w-8 place-items-center rounded-md border border-black/10 bg-white text-neutral-700 transition hover:bg-neutral-100"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
