"use client";

import { getOrderTotals } from "./order-math";
import type { OrderCharge, OrderItemData } from "./types";

type BookingSummaryProps = {
  charges: OrderCharge[];
  formatMoney: (amount: number) => string;
  items: OrderItemData[];
  labels: {
    subtotal: string;
    total: string;
  };
};

// Renders totals for any mix of booking item types.
export function BookingSummary({
  charges,
  formatMoney,
  items,
  labels,
}: BookingSummaryProps) {
  const totals = getOrderTotals(items, charges);

  return (
    <section className="rounded-lg border border-white/10 bg-neutral-900 p-4 text-white">
      <h3 className="text-base font-black">{labels.total}</h3>
      <div className="mt-4 space-y-3 text-sm">
        <SummaryRow label={labels.subtotal} value={formatMoney(totals.subtotal)} />
        {charges.map((charge) => (
          <SummaryRow
            key={charge.id}
            label={charge.label}
            value={formatMoney(charge.amount)}
          />
        ))}
        <div className="border-t border-white/15 pt-3">
          <SummaryRow
            label={labels.total}
            value={formatMoney(totals.total)}
            valueClassName="text-xl text-amber-300"
          />
        </div>
      </div>
    </section>
  );
}

// Keeps a summary line aligned and reusable.
function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-neutral-300">{label}</span>
      <span className={`font-black ${valueClassName ?? ""}`}>{value}</span>
    </div>
  );
}
