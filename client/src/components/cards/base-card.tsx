"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "./card-utils";
import type { CardType, CardMetaItem } from "./types";
import { AgeRatingBadge } from "../ui/age-rating";

/**
 * Shared reusable entertainment card.
 *
 * The goal of this component is:
 *
 * - reusable architecture
 * - emotional visual presentation
 * - content-first hierarchy
 * - scalable across ticket categories
 *
 * Unlike dashboard-like cards,
 * this version prioritizes immersion and media impact.
 */
export type BaseCardProps = {
  type: CardType;

  id: string;

  title: string;

  /**
   * Optional supporting description.
   *
   * Events usually do not need long subtitles.
   * Movies may use this more often.
   */
  subtitle?: string;

  /**
   * Main visual media.
   *
   * - movie:
   *   usually portrait poster
   *
   * - event/concert:
   *   usually landscape photography
   */
  imageSrc: string;

  imageAlt?: string;

  /**
   * Optional floating badge.
   *
   * Examples:
   * - "From $39"
   * - "IMAX"
   * - "HOT"
   * - "Selling Fast"
   */
  badge?: string;

  /**
   * Small metadata chips shown under content.
   */
  meta?: CardMetaItem[];

  href?: string;

  ariaLabel?: string;

  isActive?: boolean;

  onClick?: () => void;

  className?: string;

  /**
   * Optional overlay content.
   *
   * Allows category-specific customization
   * without forking the entire component.
   */
  overlayContent?: ReactNode;

  /**
   * Optional footer actions.
   */
  children?: ReactNode;

  ageRating?: string;
};

const mediaAspectMap: Record<CardType, string> = {
  movie: "aspect-[2/3]",
  event: "aspect-[16/9]",
  concert: "aspect-[16/9]",
  tour: "aspect-[4/3]",
};

const metaToneClassNames = {
  amber: "bg-amber-500/15 text-amber-200",
  blue: "bg-blue-500/15 text-blue-200",
  neutral: "bg-white/10 text-white/80",
  red: "bg-red-500/15 text-red-200",
  teal: "bg-teal-500/15 text-teal-200",
};

export function BaseCard({
  ariaLabel,
  ageRating,
  badge,
  children,
  className,
  href,
  id,
  imageAlt = "",
  imageSrc,
  isActive,
  meta = [],
  onClick,
  overlayContent,
  subtitle,
  title,
  type,
}: BaseCardProps) {
  const isMovie = type === "movie";
  const isRemoteImage = /^https?:\/\//i.test(imageSrc);

  /**
   * Entertainment-focused card design:
   *
   * - darker visual language
   * - image-first hierarchy
   * - immersive presentation
   * - reduced "dashboard card" feeling
   */
  const cardClassName = cn(
    "group relative block overflow-hidden rounded-3xl text-left",
    "bg-neutral-950 transition duration-300",
    "hover:-translate-y-1 hover:shadow-2xl",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40",
    // isActive && "ring-2 ring-red-500/40",
    className,
  );

  const content = (
    <>
      {/* =========================================================
          MEDIA SECTION
         ========================================================= */}

      <div
        className={cn(
          "relative overflow-hidden",
          mediaAspectMap[type],
        )}
      >
        {/* 
          Main artwork.
          
          object-cover is critical here.
          
          Entertainment cards should feel immersive,
          not like uploaded files inside containers.
        */}
        {isRemoteImage ? (
          // Remote catalog URLs are admin-provided, so the browser loads them directly instead of proxying arbitrary hosts through Next's image optimizer.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt}
            className="
              absolute inset-0 h-full w-full object-cover transition duration-500
              group-hover:scale-[1.04]
            "
          />
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="
              object-cover transition duration-500
              group-hover:scale-[1.04]
            "
          />
        )}

        {/* 
          Gradient overlay improves readability
          while preserving image impact.
        */}
        <div
          className={cn(
            "absolute inset-0",
            isMovie
              ? "bg-gradient-to-t from-black via-black/30 to-transparent"
              : "bg-gradient-to-t from-black/95 via-black/40 to-transparent",
          )}
        />

          {/* 
            Floating badge.
            
            Positioned over the artwork
            for stronger emotional visibility.
          */}
          {badge ? (
            <div className="absolute left-4 top-4 z-20">
              <span
                className="
                  rounded-full bg-red-600 px-3 py-1
                  text-xs font-black tracking-wide text-white
                  shadow-lg backdrop-blur-md
                "
              >
                {badge}
              </span>
            </div>
          ) : null}

          {ageRating ? (
            <div className="absolute right-4 top-4 z-20">
              <AgeRatingBadge rating={ageRating} />
            </div>
          ) : null}

          {/* 
            Overlay slot for type-specific content.
            
            Example:
            - live status
            - ranking
            - countdown
            - popularity
          */}
          {overlayContent ? (
            <div className="absolute right-4 top-4 z-20">
              {overlayContent}
            </div>
          ) : null}

          {/* =========================================================
              PRIMARY CONTENT OVER IMAGE
            ========================================================= */}

          <div className="absolute inset-x-0 bottom-0 z-10 p-5">
            <div className="max-w-[90%]">
              <h3
                className="
                  line-clamp-2 text-xl font-black
                  leading-tight text-white
                "
              >
                {title}
              </h3>

              {subtitle ? (
                <p
                  className="
                    mt-2 line-clamp-2 text-sm
                    leading-6 text-white/75
                  "
                >
                  {subtitle}
                </p>
              ) : null}
            </div>

          {/* =====================================================
              META SECTION
             ===================================================== */}

          {meta.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.map((item) => (
                <span
                  key={item.value}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                    "text-xs font-bold backdrop-blur-md",
                    metaToneClassNames[item.tone ?? "neutral"],
                  )}
                >
                  {item.icon}
                  {item.value}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* =========================================================
          OPTIONAL FOOTER ACTIONS
         ========================================================= */}

      {children ? (
        <div className="border-t border-white/10 bg-black/40 p-4">
          {children}
        </div>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        key={id}
        aria-label={ariaLabel}
        href={href}
        className={cardClassName}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      key={id}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isActive}
      onClick={onClick}
      className={cardClassName}
    >
      {content}
    </button>
  );
}

/**
 * Shared responsive grid for entertainment cards.
 *
 * The spacing is intentionally larger
 * than enterprise dashboard grids.
 */
export function BaseCardGrid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        grid gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {children}
    </div>
  );
}
