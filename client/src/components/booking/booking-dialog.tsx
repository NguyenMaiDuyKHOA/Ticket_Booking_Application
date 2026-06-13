"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/components/cards/card-utils";
import { BaseOrder } from "@/components/order";
import { getOrderItemTypeConfig } from "@/components/order/order-item-registry";
import type { OrderCharge, OrderItemData, PaymentMethod } from "@/components/order";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type BookingDialogItem = {
  description?: string;
  id: string;
  image?: string;
  item_type: string;
  metadata?: Array<{
    label: string;
    value: string;
  }>;
  title: string;
  unitPrice: number;
};

export type BookingSeatMap = {
  availableLabel: string;
  screenLabel: string;
  selectedLabel: string;
  selectedSeats: string[];
  seatAriaLabel: (seat: string) => string;
  rows: string[];
  takenLabel: string;
  unavailableSeats: Set<string>;
  onToggleSeat: (seat: string) => void;
};

type BookingDialogProps = {
  addOnItems?: OrderItemData[];
  charges?: OrderCharge[];
  checkoutLabels?: {
    continueLabel?: string;
    decreaseLabel?: string;
    increaseLabel?: string;
    orderSubtitle?: string;
    orderTitle?: string;
    paymentTitle?: string;
    subtotal?: string;
    total?: string;
  };
  formatMoney: (amount: number) => string;
  item: BookingDialogItem;
  onAddOnQuantityChange?: (itemId: string, quantity: number) => void;
  onOpenChange: (open: boolean) => void;
  onPaymentMethodChange?: (methodId: string) => void;
  onTicketQuantityChange?: (quantity: number) => void;
  open: boolean;
  paymentMethods?: PaymentMethod[];
  seatMap?: BookingSeatMap;
  selectedPaymentMethodId?: string;
  ticketQuantity?: number;
};

const defaultCheckoutLabels = {
  continueLabel: "Checkout",
  decreaseLabel: "Decrease quantity",
  increaseLabel: "Increase quantity",
  orderSubtitle: "Tickets and add-ons in one order",
  orderTitle: "Order summary",
  paymentTitle: "Payment method",
  subtotal: "Subtotal",
  total: "Total",
};

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: "card",
    label: "Bank card",
    description: "Pay with domestic or international cards.",
  },
  {
    id: "wallet",
    label: "E-wallet",
    description: "Use an e-wallet for a faster checkout.",
  },
  {
    id: "transfer",
    label: "Bank transfer",
    description: "Receive bank transfer instructions after confirmation.",
  },
];

// Renders the reusable controlled booking modal for every ticket item_type.
export function BookingDialog({
  addOnItems = [],
  charges = [],
  checkoutLabels = {},
  formatMoney,
  item,
  onAddOnQuantityChange,
  onOpenChange,
  onPaymentMethodChange,
  onTicketQuantityChange,
  open,
  paymentMethods = defaultPaymentMethods,
  seatMap,
  selectedPaymentMethodId = paymentMethods[0]?.id ?? "card",
  ticketQuantity = 1,
}: BookingDialogProps) {
  const labels = {
    ...defaultCheckoutLabels,
    ...checkoutLabels,
  };
  const [internalPaymentMethodId, setInternalPaymentMethodId] = useState(
    selectedPaymentMethodId,
  );
  const activePaymentMethodId =
    selectedPaymentMethodId ?? internalPaymentMethodId;
  const itemTypeConfig = getOrderItemTypeConfig(item.item_type);
  const TypeIcon = itemTypeConfig.icon;
  const resolvedQuantity = seatMap ? seatMap.selectedSeats.length : ticketQuantity;
  const orderItems: OrderItemData[] = [
    {
      description: item.description,
      id: item.id,
      image: item.image,
      item_type: item.item_type,
      metadata: item.metadata,
      quantity: resolvedQuantity,
      quantityEditable: !seatMap,
      title: item.title,
      unitPrice: item.unitPrice,
    },
    ...addOnItems,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="booking-dialog-description">
        <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="min-w-0 p-4 sm:p-6">
            <DialogHeader className="pr-10">
              <div
                className={cn(
                  "mb-2 inline-flex w-fit items-center gap-2 rounded-md px-2.5 py-1 text-xs font-black",
                  itemTypeConfig.toneClassName,
                )}
              >
                <TypeIcon className="h-4 w-4" aria-hidden="true" />
                {itemTypeConfig.label}
              </div>
              <DialogTitle className="text-xl font-black leading-7 text-neutral-950 sm:text-2xl">
                {item.title}
              </DialogTitle>
              <DialogDescription
                id="booking-dialog-description"
                className="text-sm leading-6 text-neutral-600"
              >
                {item.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4 md:grid-cols-[160px_1fr]">
              {item.image ? (
                <div className="relative aspect-[5/7] overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-contain"
                    aria-hidden="true"
                  />
                </div>
              ) : null}

              <div className="grid content-start gap-4">
                {item.metadata?.length ? (
                  <dl className="grid gap-3 rounded-lg border border-black/10 bg-neutral-50 p-3 sm:grid-cols-2">
                    {item.metadata.map((meta) => (
                      <div key={`${item.id}-${meta.label}`} className="min-w-0">
                        <dt className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                          {meta.label}
                        </dt>
                        <dd className="mt-1 truncate text-sm font-black text-neutral-950">
                          {meta.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <TicketQuantityControl
                  disabled={Boolean(seatMap)}
                  formatMoney={formatMoney}
                  onChange={onTicketQuantityChange}
                  quantity={resolvedQuantity}
                  unitPrice={item.unitPrice}
                />
              </div>
            </div>

            {seatMap ? <BookingSeatSelector seatMap={seatMap} /> : null}
          </section>

          <aside className="border-t border-black/10 bg-neutral-50 p-4 sm:p-6 lg:border-l lg:border-t-0">
            <BaseOrder
              charges={charges}
              disabled={resolvedQuantity === 0}
              formatMoney={formatMoney}
              items={orderItems}
              labels={{
                checkout: labels.continueLabel,
                decreaseQuantity: labels.decreaseLabel,
                increaseQuantity: labels.increaseLabel,
                orderSubtitle: labels.orderSubtitle,
                orderTitle: labels.orderTitle,
                paymentTitle: labels.paymentTitle,
                subtotal: labels.subtotal,
                total: labels.total,
              }}
              onPaymentMethodChange={
                onPaymentMethodChange ?? setInternalPaymentMethodId
              }
              onItemQuantityChange={onAddOnQuantityChange}
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={activePaymentMethodId}
            />
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Handles generic ticket quantity when the booking flow does not use a seat map.
function TicketQuantityControl({
  disabled,
  formatMoney,
  onChange,
  quantity,
  unitPrice,
}: {
  disabled: boolean;
  formatMoney: (amount: number) => string;
  onChange?: (quantity: number) => void;
  quantity: number;
  unitPrice: number;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-neutral-950">Ticket quantity</p>
          <p className="mt-1 text-xs text-neutral-600">
            {formatMoney(unitPrice)} each
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            disabled={disabled || quantity <= 1}
            onClick={() => onChange?.(quantity - 1)}
            className="grid h-9 w-9 place-items-center rounded-md border border-black/10 bg-white text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Decrease quantity</span>
          </button>
          <span className="w-8 text-center text-sm font-black text-neutral-950">
            {quantity}
          </span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(quantity + 1)}
            className="grid h-9 w-9 place-items-center rounded-md border border-black/10 bg-white text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Increase quantity</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Renders a reusable accessible seat map for seated ticket flows.
function BookingSeatSelector({ seatMap }: { seatMap: BookingSeatMap }) {
  return (
    <section className="mt-5 rounded-lg border border-black/10 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-black text-neutral-950">Seat selection</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-500">
          <SeatLegend colorClassName="border border-black/20 bg-white" label={seatMap.availableLabel} />
          <SeatLegend colorClassName="bg-red-700" label={seatMap.selectedLabel} />
          <SeatLegend colorClassName="bg-neutral-300" label={seatMap.takenLabel} />
        </div>
      </div>

      <div className="mb-4 h-2 rounded-md bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      <p className="-mt-2 mb-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        {seatMap.screenLabel}
      </p>

      <div className="space-y-2 overflow-x-auto pb-1">
        {seatMap.rows.map((row) => (
          <div
            key={row}
            className="grid min-w-[316px] grid-cols-[24px_repeat(8,32px)] items-center gap-2"
          >
            <span className="text-xs font-black text-neutral-500">{row}</span>
            {Array.from({ length: 8 }, (_, index) => {
              const seat = `${row}${index + 1}`;
              const isUnavailable = seatMap.unavailableSeats.has(seat);
              const isSelected = seatMap.selectedSeats.includes(seat);

              return (
                <button
                  key={seat}
                  type="button"
                  disabled={isUnavailable}
                  aria-label={seatMap.seatAriaLabel(seat)}
                  aria-pressed={isSelected}
                  onClick={() => seatMap.onToggleSeat(seat)}
                  className={`h-8 w-8 rounded-md text-xs font-black transition ${
                    isUnavailable
                      ? "cursor-not-allowed bg-neutral-300 text-neutral-400"
                      : isSelected
                        ? "bg-red-700 text-white"
                        : "border border-black/10 bg-white text-neutral-700 hover:border-teal-700 hover:bg-teal-50"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

// Displays one seat state in the selector legend.
function SeatLegend({
  colorClassName,
  label,
}: {
  colorClassName: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("h-3 w-3 rounded-sm", colorClassName)} />
      {label}
    </span>
  );
}
