"use client";

import { ChevronRight, CreditCard } from "lucide-react";

import type { PaymentMethod } from "./types";

type CheckoutSectionProps = {
  disabled?: boolean;
  label: string;
  methods: PaymentMethod[];
  onCheckout?: () => void;
  onMethodChange: (methodId: string) => void;
  selectedMethodId: string;
  title: string;
};

// Renders payment method selection and checkout action for the shared order flow.
export function CheckoutSection({
  disabled = false,
  label,
  methods,
  onCheckout,
  onMethodChange,
  selectedMethodId,
  title,
}: CheckoutSectionProps) {
  return (
    <section id="checkout" className="rounded-lg bg-neutral-950 p-4 text-white">
      <h3 className="flex items-center gap-2 text-base font-black">
        <CreditCard className="h-5 w-5 text-amber-300" aria-hidden="true" />
        {title}
      </h3>

      <div className="mt-4 grid gap-2">
        {methods.map((method) => {
          const isActive = selectedMethodId === method.id;

          return (
            <button
              key={method.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onMethodChange(method.id)}
              className={`rounded-lg border p-3 text-left transition ${
                isActive
                  ? "border-amber-300 bg-white/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
              }`}
            >
              <span className="block text-sm font-black">{method.label}</span>
              <span className="mt-1 block text-xs leading-5 text-neutral-300">
                {method.description}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onCheckout}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-400 px-4 py-3 text-sm font-black text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
      >
        {label}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>
  );
}
