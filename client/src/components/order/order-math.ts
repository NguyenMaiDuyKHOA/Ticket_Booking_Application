import type { OrderCharge, OrderItemData } from "./types";

// Calculates totals from any number of dynamic order items and charges.
export function getOrderTotals(items: OrderItemData[], charges: OrderCharge[]) {
  const subtotal = items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const chargesTotal = charges.reduce((total, charge) => total + charge.amount, 0);

  return {
    chargesTotal,
    subtotal,
    total: subtotal + chargesTotal,
  };
}
