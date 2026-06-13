"use client";

import { useState } from "react";

import { getOrderTotals } from "./order-math";
import type { OrderCharge, OrderItemData } from "./types";

// Manages cart-style order item mutations independently from item_type.
export function useBookingOrder(initialItems: OrderItemData[] = []) {
  const [items, setItems] = useState(initialItems);

  function addItem(nextItem: OrderItemData) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === nextItem.id);

      if (!existingItem) {
        return [...currentItems, nextItem];
      }

      return currentItems.map((item) =>
        item.id === nextItem.id
          ? { ...item, quantity: item.quantity + nextItem.quantity }
          : item,
      );
    });
  }

  function removeItem(itemId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }

  function updateQuantity(itemId: string, quantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item,
      ),
    );
  }

  function getTotals(charges: OrderCharge[] = []) {
    return getOrderTotals(items, charges);
  }

  return {
    addItem,
    getTotals,
    items,
    removeItem,
    setItems,
    updateQuantity,
  };
}
