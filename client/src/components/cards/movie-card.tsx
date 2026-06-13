"use client";

import { CalendarDays, Clock3, Star } from "lucide-react";

import { BaseCard } from "./base-card";

/**
 * Movie cards should feel:
 * - cinematic
 * - premium
 * - poster-focused
 *
 * Unlike event cards,
 * movies rely more heavily on vertical poster identity.
 */
export type MovieCardProps = {
  id: string;

  title: string;

  image: string;

  /**
   * Short movie synopsis or genre line.
   */
  description?: string;

  /**
   * Examples:
   * - "2h 14m"
   * - "PG-13"
   * - "Action • Sci-Fi"
   */
  duration?: string;

  /**
   * Public release/start date shown on listing cards.
   */
  startDate?: string;

  /**
   * Rating score.
   */
  score?: number;

  /**
   * Optional promotional badge.
   *
   * Examples:
   * - "IMAX"
   * - "Now Showing"
   * - "Top 1"
   */
  badge?: string;

  href?: string;

  isActive?: boolean;

  ageRating?: string;

  onClick?: () => void;
};

export function MovieCard({
  badge,
  description,
  duration,
  href,
  id,
  image,
  isActive,
  onClick,
  score,
  startDate,
  title,
  ageRating,
}: MovieCardProps) {
  return (
    <BaseCard
      type="movie"
      badge={badge}
      href={href}
      id={id}
      imageAlt={title}
      imageSrc={image}
      isActive={isActive}
      meta={[
        ...(score
          ? [
            {
              icon: (
                <Star
                  className="h-3.5 w-3.5 fill-current"
                  aria-hidden="true"
                />
              ),
              tone: "amber" as const,
              value: `${score}/10`,
            },
          ]
          : []),

        ...(duration
          ? [
            {
              icon: (
                <Clock3
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              ),
              value: duration,
            },
          ]
          : []),
        ...(startDate
          ? [
            {
              icon: (
                <CalendarDays
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              ),
              value: startDate,
            },
          ]
          : []),
      ]}
      onClick={onClick}
      subtitle={description}
      title={title}
      ageRating={ageRating}
    />
  );
}
