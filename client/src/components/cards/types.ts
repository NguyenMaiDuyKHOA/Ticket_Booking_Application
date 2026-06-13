import type { ReactNode } from "react";

/**
 * Metadata chip displayed inside the card footer.
 */
export type CardMetaItem = {
  icon?: ReactNode;
  tone?: "neutral" | "red" | "teal" | "amber" | "blue";
  value: string;
};

/**
 * Card types define:
 * - media composition
 * - emotional tone
 * - visual hierarchy
 *
 * Different entertainment categories should not feel identical.
 */
export type CardType =
  | "movie"
  | "event"
  | "concert"
  | "tour";

export type TicketCardAction = {
  href?: string;
  onClick?: () => void;
};

export type SelectableCardState = {
  ariaLabel: string;
  isActive?: boolean;
};

export type BaseTicketCardProps = SelectableCardState &
  TicketCardAction & {
    type: "movie" | "event" | "tour";
    badge?: string;
    children?: ReactNode;
    className?: string;
    id: string;
    imageAlt?: string;
    imageClassName?: string;
    imageSizes?: string;
    imageSrc: string;
    meta: CardMetaItem[];
    subtitle: string;
    title: string;
  };
