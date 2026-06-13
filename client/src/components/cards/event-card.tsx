// event-card.tsx

"use client";

import {
  CalendarDays,
  Flame,
  MapPin,
  Ticket,
} from "lucide-react";

import { BaseCard } from "./base-card";

/**
 * Event / concert cards should feel:
 * - energetic
 * - immersive
 * - alive
 *
 * The visual hierarchy prioritizes:
 * - artwork
 * - atmosphere
 * - urgency
 */
export type EventCardProps = {
  id: string;

  title: string;

  image: string;

  /**
   * Examples:
   * - "Concert"
   * - "Festival"
   * - "Fan Meeting"
   */
  eventType: string;

  date: string;

  location: string;

  /**
   * Examples:
   * - "From $39"
   * - "Selling Fast"
   * - "Limited Seats"
   */
  badge?: string;

  /**
   * Optional trending state.
   *
   * Adds emotional urgency.
   */
  isTrending?: boolean;

  href?: string;

  isActive?: boolean;

  onClick?: () => void;
};

export function EventCard({
  badge,
  date,
  eventType,
  href,
  id,
  image,
  isActive,
  isTrending,
  location,
  onClick,
  title,
}: EventCardProps) {
  return (
    <BaseCard
      type="event"
      badge={badge}
      href={href}
      id={id}
      imageAlt={title}
      imageSrc={image}
      isActive={isActive}
      meta={[
        {
          icon: (
            <Ticket
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          ),
          tone: "red",
          value: eventType,
        },
        {
          icon: (
            <CalendarDays
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          ),
          value: date,
        },
        {
          icon: (
            <MapPin
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          ),
          tone: "teal",
          value: location,
        },
      ]}
      onClick={onClick}
      overlayContent={
        isTrending ? (
          <div
            className="
              inline-flex items-center gap-1.5
              rounded-full bg-orange-500 px-3 py-1.5
              text-xs font-black tracking-wide text-white
              shadow-xl
            "
          >
            <Flame className="h-3.5 w-3.5" />
            TRENDING
          </div>
        ) : null
      }
      title={title}
    />
  );
}


// ===========================================================================================

// import { CalendarDays, MapPin, Ticket } from "lucide-react";

// import { BaseCard } from "./base-card";
// import type { SelectableCardState, TicketCardAction } from "./types";

// export type EventCardProps = SelectableCardState &
//   Partial<TicketCardAction> & {
//     date: string;
//     eventType: string;
//     id: string;
//     image: string;
//     location: string;
//     priceLabel?: string;
//     title: string;
//   };

// // Renders event-specific booking data on top of the shared BaseCard shell.
// export function EventCard({
//   ariaLabel,
//   date,
//   eventType,
//   href,
//   id,
//   image,
//   isActive,
//   location,
//   onClick,
//   priceLabel,
//   title,
// }: EventCardProps) {
//   return (
//     <BaseCard
//       type="event"
//       ariaLabel={ariaLabel}
//       badge={priceLabel}
//       href={href}
//       id={id}
//       imageSrc={image}
//       isActive={isActive}
//       location={location}
//       meta={[
//         {
//           icon: <Ticket className="h-3.5 w-3.5" aria-hidden="true" />,
//           tone: "red",
//           value: eventType,
//         },
//         {
//           icon: <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />,
//           value: date,
//         },
//         {
//           icon: <MapPin className="h-3.5 w-3.5" aria-hidden="true" />,
//           tone: "teal",
//           value: location,
//         },
//       ]}
//       onClick={onClick}
//       subtitle={eventType}
//       title={title}
//     />
//   );
// }
