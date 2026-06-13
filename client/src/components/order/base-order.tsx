"use client";

import { ShoppingBag } from "lucide-react";

import { BookingItem } from "./booking-item";
import { BookingSummary } from "./booking-summary";
import { CheckoutSection } from "./checkout-section";
import type {
  BookingItemRendererMap,
  BookingOrderLabels,
  OrderCharge,
  OrderItemData,
  PaymentMethod,
} from "./types";

type BaseOrderProps = {
  charges?: OrderCharge[];
  disabled?: boolean;
  formatMoney: (amount: number) => string;
  itemRenderers?: BookingItemRendererMap;
  items: OrderItemData[];
  labels: BookingOrderLabels;
  onCheckout?: () => void;
  onItemQuantityChange?: (itemId: string, quantity: number) => void;
  onItemRemove?: (itemId: string) => void;
  onPaymentMethodChange: (methodId: string) => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string;
};

// Composes the generic cart-style order flow without ticket type branching.
export function BaseOrder({
  charges = [],
  disabled = false,
  formatMoney,
  itemRenderers,
  items,
  labels,
  onCheckout,
  onItemQuantityChange,
  onItemRemove,
  onPaymentMethodChange,
  paymentMethods,
  selectedPaymentMethodId,
}: BaseOrderProps) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-neutral-950 text-white">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-black text-neutral-950">
              {labels.orderTitle}
            </h3>
            {labels.orderSubtitle ? (
              <p className="mt-1 text-sm leading-5 text-neutral-600">
                {labels.orderSubtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <BookingItem
              key={item.id}
              formatMoney={formatMoney}
              item={item}
              labels={{
                decreaseQuantity: labels.decreaseQuantity,
                increaseQuantity: labels.increaseQuantity,
              }}
              onQuantityChange={onItemQuantityChange}
              onRemove={onItemRemove}
              renderers={itemRenderers}
            />
          ))}
        </div>
      </section>

      <BookingSummary
        charges={charges}
        formatMoney={formatMoney}
        items={items}
        labels={{
          subtotal: labels.subtotal,
          total: labels.total,
        }}
      />

      <CheckoutSection
        disabled={disabled}
        label={labels.checkout}
        methods={paymentMethods}
        onCheckout={onCheckout}
        onMethodChange={onPaymentMethodChange}
        selectedMethodId={selectedPaymentMethodId}
        title={labels.paymentTitle}
      />
    </div>
  );
}
