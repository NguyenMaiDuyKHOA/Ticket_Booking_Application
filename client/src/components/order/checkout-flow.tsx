"use client";

import { BaseOrder } from "./base-order";
import type { OrderCharge, OrderItemData, PaymentMethod } from "./types";

type CheckoutFlowProps = {
  charges: OrderCharge[];
  continueLabel: string;
  decreaseLabel?: string;
  disabled?: boolean;
  formatMoney: (amount: number) => string;
  increaseLabel?: string;
  items: OrderItemData[];
  labels: {
    orderSubtitle?: string;
    orderTitle: string;
    paymentTitle: string;
    subtotal: string;
    total: string;
  };
  onPaymentMethodChange: (methodId: string) => void;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string;
};

// Composes shared order items, summary, and payment into one checkout flow.
export function CheckoutFlow({
  charges,
  continueLabel,
  decreaseLabel,
  disabled,
  formatMoney,
  increaseLabel,
  items,
  labels,
  onPaymentMethodChange,
  onQuantityChange,
  paymentMethods,
  selectedPaymentMethodId,
}: CheckoutFlowProps) {
  return (
    <BaseOrder
      charges={charges}
      disabled={disabled}
      formatMoney={formatMoney}
      items={items}
      labels={{
        checkout: continueLabel,
        decreaseQuantity: decreaseLabel ?? "Decrease quantity",
        increaseQuantity: increaseLabel ?? "Increase quantity",
        orderSubtitle: labels.orderSubtitle,
        orderTitle: labels.orderTitle,
        paymentTitle: labels.paymentTitle,
        subtotal: labels.subtotal,
        total: labels.total,
      }}
      onItemQuantityChange={onQuantityChange}
      onPaymentMethodChange={onPaymentMethodChange}
      paymentMethods={paymentMethods}
      selectedPaymentMethodId={selectedPaymentMethodId}
    />
  );
}
