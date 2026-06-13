"use client";

import { Clock3, Map, MapPin } from "lucide-react";

import { BaseCard } from "./base-card";
import type { SelectableCardState, TicketCardAction } from "./types";

export type TourCardProps = SelectableCardState &
  Partial<TicketCardAction> & {
    duration: string;
    id: string;
    image: string;
    location: string;
    priceLabel?: string;
    title: string;
    tourType: string;
  };

// Renders tour-specific booking data on top of the shared BaseCard shell.
export function TourCard({
  ariaLabel,
  duration,
  href,
  id,
  image,
  isActive,
  location,
  onClick,
  priceLabel,
  title,
  tourType,
}: TourCardProps) {
  return (
    <BaseCard
      ariaLabel={ariaLabel}
      badge={priceLabel}
      href={href}
      id={id}
      imageSrc={image}
      isActive={isActive}
      type="tour"
      meta={[
        {
          icon: <Map className="h-3.5 w-3.5" aria-hidden="true" />,
          tone: "blue",
          value: tourType,
        },
        {
          icon: <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />,
          value: duration,
        },
        {
          icon: <MapPin className="h-3.5 w-3.5" aria-hidden="true" />,
          tone: "teal",
          value: location,
        },
      ]}
      onClick={onClick}
      subtitle={tourType}
      title={title}
    />
  );
}
