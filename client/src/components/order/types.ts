import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type OrderItemType = "movie" | "concert" | "event" | "tour" | string;

export type OrderItemMeta = {
  label: string;
  value: string;
};

export type OrderItemData = {
  description?: string;
  id: string;
  image?: string;
  item_type: OrderItemType;
  metadata?: OrderItemMeta[];
  quantityEditable?: boolean;
  quantity: number;
  title: string;
  unitPrice: number;
};

export type OrderCharge = {
  amount: number;
  id: string;
  label: string;
};

export type PaymentMethod = {
  description: string;
  id: string;
  label: string;
};

export type OrderItemTypeConfig = {
  icon: LucideIcon;
  label: string;
  renderDetails?: (item: OrderItemData) => ReactNode;
  toneClassName: string;
};

export type BookingOrderLabels = {
  checkout: string;
  decreaseQuantity: string;
  increaseQuantity: string;
  orderSubtitle?: string;
  orderTitle: string;
  paymentTitle: string;
  subtotal: string;
  total: string;
};

export type BookingItemRendererMap = Partial<
  Record<OrderItemType, (item: OrderItemData) => ReactNode>
>;
