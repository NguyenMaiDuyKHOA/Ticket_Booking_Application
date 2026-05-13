"use client";

import Image from "next/image";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export type RankType = "home" | "cgv" | "event" | "concert" | "tour";

type RankItem = {
  id: string;
  image: string;
  href: string;
  score: string;
};

type RankProps = {
  type: RankType;
  className?: string;
};

// Defines the shared ranked-ticket data used by Home and category pages.
const rankItemsByType: Record<RankType, RankItem[]> = {
  home: [
    {
      id: "cgv",
      image: "/Poster/Thor_poster_cgv.jpg",
      href: "/cgv/midnight",
      score: "9.4",
    },
    {
      id: "event",
      image: "/bell.png",
      href: "/event/festival",
      score: "9.1",
    },
    {
      id: "tour",
      image: "/vietnam.png",
      href: "/tour/saigon",
      score: "8.9",
    },
  ],
  cgv: [
    {
      id: "thor",
      image: "/Poster/Thor_poster_cgv.jpg",
      href: "/cgv/midnight",
      score: "9.5",
    },
    {
      id: "perfume",
      image: "/Poster/Perfume_poster.jpg",
      href: "/cgv/orbit",
      score: "9.2",
    },
    {
      id: "zoo",
      image: "/Poster/Zoologico_poster.jpg",
      href: "/cgv/thewind",
      score: "8.8",
    },
  ],
  event: [
    {
      id: "festival",
      image: "/bell.png",
      href: "/event/festival",
      score: "9.3",
    },
    {
      id: "expo",
      image: "/cart.png",
      href: "/event/expo",
      score: "8.9",
    },
    {
      id: "workshop",
      image: "/logo.png",
      href: "/event/workshop",
      score: "8.6",
    },
  ],
  concert: [
    {
      id: "arena",
      image: "/cart.png",
      href: "/concert/arena",
      score: "9.6",
    },
    {
      id: "acoustic",
      image: "/bell.png",
      href: "/concert/acoustic",
      score: "9.0",
    },
    {
      id: "festival",
      image: "/logo.png",
      href: "/concert/festival",
      score: "8.7",
    },
  ],
  tour: [
    {
      id: "saigon",
      image: "/vietnam.png",
      href: "/tour/saigon",
      score: "9.4",
    },
    {
      id: "heritage",
      image: "/logo.png",
      href: "/tour/heritage",
      score: "9.0",
    },
    {
      id: "food",
      image: "/cart.png",
      href: "/tour/food",
      score: "8.8",
    },
  ],
};

// Renders a ranked list that can be reused by Home and each ticket category page.
export function Rank({ type, className = "" }: RankProps) {
  const t = useTranslations("Rank");
  const items = rankItemsByType[type];

  return (
    <div
      className={`rounded-lg border border-black/10 bg-white p-4 shadow-sm ${className}`}
    >
      {/* Rank header explains the current ranking context. */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-red-700">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 text-xl font-black text-neutral-950">
            {t(`${type}.title`)}
          </h2>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {t(`${type}.subtitle`)}
          </p>
        </div>
      </div>

      {/* Rank items keep the visual footprint compact for sidebar placement. */}
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-black/10 bg-neutral-50 p-2 transition hover:border-neutral-400 hover:bg-white"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-neutral-950 text-sm font-black text-white">
              {index + 1}
            </span>

            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-200">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black text-neutral-950">
                  {t(`${type}.items.${item.id}.title`)}
                </h3>
                <p className="truncate text-xs font-medium text-neutral-500">
                  {t(`${type}.items.${item.id}.meta`)}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-black text-amber-800">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              {item.score}
            </span>
          </Link>
        ))}
      </div>

      {/* Secondary CTA leaves room for future category-specific list pages. */}
      <Link
        href={type === "cgv" ? "/cgv" : "#ticket-types"}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-neutral-950 px-4 py-3 text-sm font-black text-white transition hover:bg-neutral-800"
      >
        {t(`${type}.cta`)}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
