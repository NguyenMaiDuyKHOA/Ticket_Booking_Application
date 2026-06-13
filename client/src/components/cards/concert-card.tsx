"use client";

import { CalendarDays, MapPin, Music2 } from "lucide-react";

import { BaseCard } from "./base-card";
import type { SelectableCardState, TicketCardAction } from "./types";

export type ConcertCardProps = SelectableCardState &
  Partial<TicketCardAction> & {
    artist: string;
    date: string;
    id: string;
    image: string;
    priceLabel?: string;
    title: string;
    venue: string;
  };

// Renders concert-specific booking data on top of the shared BaseCard shell.
export function ConcertCard({
  ariaLabel,
  artist,
  date,
  href,
  id,
  image,
  isActive,
  onClick,
  priceLabel,
  title,
  venue,
}: ConcertCardProps) {
  return (
    <BaseCard
      ariaLabel={ariaLabel}
      badge={priceLabel}
      href={href}
      id={id}
      imageSrc={image}
      isActive={isActive}
      type="concert"
      meta={[
        {
          icon: <Music2 className="h-3.5 w-3.5" aria-hidden="true" />,
          tone: "amber",
          value: artist,
        },
        {
          icon: <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />,
          value: date,
        },
        {
          icon: <MapPin className="h-3.5 w-3.5" aria-hidden="true" />,
          tone: "teal",
          value: venue,
        },
      ]}
      onClick={onClick}
      subtitle={artist}
      title={title}
    />
  );
}
