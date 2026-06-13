"use client";

import type { OrderCharge, OrderItemData } from "./types";

type OrderSummaryProps = {
  charges: OrderCharge[];
  formatMoney: (amount: number) => string;
  items: OrderItemData[];
  labels: {
    charges?: string;
    subtotal: string;
    total: string;
  };
  total: number;
};

// Renders price totals independently from ticket type-specific data.
export function OrderSummary({
  charges,
  formatMoney,
  items,
  labels,
  total,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (currentTotal, item) => currentTotal + item.unitPrice * item.quantity,
    0,
  );

  return (
    <section className="rounded-lg border border-white/10 bg-neutral-900 p-4 text-white">
      <h3 className="text-base font-black">{labels.total}</h3>
      <div className="mt-4 space-y-3 text-sm">
        <SummaryRow label={labels.subtotal} value={formatMoney(subtotal)} />
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
            value={formatMoney(total)}
            valueClassName="text-xl text-amber-300"
          />
        </div>
      </div>
    </section>
  );
}

// Keeps every summary line aligned across breakpoints.
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
