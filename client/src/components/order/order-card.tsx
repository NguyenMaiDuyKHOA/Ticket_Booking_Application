"use client";

import { ShoppingBag } from "lucide-react";

import { OrderItem } from "./order-item";
import type { OrderItemData } from "./types";

type OrderCardProps = {
  decreaseLabel?: string;
  formatMoney: (amount: number) => string;
  increaseLabel?: string;
  items: OrderItemData[];
  onQuantityChange?: (itemId: string, quantity: number) => void;
  subtitle?: string;
  title: string;
};

// Groups multiple order items inside one reusable order card.
export function OrderCard({
  decreaseLabel,
  formatMoney,
  increaseLabel,
  items,
  onQuantityChange,
  subtitle,
  title,
}: OrderCardProps) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-neutral-950 text-white">
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-black text-neutral-950">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm leading-5 text-neutral-600">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <OrderItem
            key={item.id}
            decreaseLabel={decreaseLabel}
            formatMoney={formatMoney}
            increaseLabel={increaseLabel}
            item={item}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </section>
  );
}
