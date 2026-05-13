"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Star } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { createDominantBannerBackground } from "@/lib/color";

type BannerType = "movie" | "event" | "tour";

type BannerItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  fallbackColor: string;
  ctaText: string;
  href: string;
  meta?: {
    score?: number;
    date?: string;
    location?: string;
  };
};

type BannerProps = {
  selectedBanner: BannerItem;
  type: BannerType;
};

// const dominantColor = useDominantColor(activeSlide.image, {
//   fallbackColor: activeSlide.fallbackColor,
// });
// const sliderBackground = useMemo(
//   () => createDominantBannerBackground(dominantColor.hex),
//   [dominantColor.hex],
// );

// Renders a visual feature banner for a ticket category page.
export function Banner({ selectedBanner, type }: BannerProps) {
  const bannerDominantColor = useDominantColor(selectedBanner.image, {
    fallbackColor: selectedBanner.fallbackColor,
  });
  const bannerBackground = createDominantBannerBackground(bannerDominantColor.hex);

  return (
    <section className="bg-neutral-950 px-4 py-6 sm:px-6 lg:px-8">
      <div
        className="relative mx-auto aspect-[21/9] max-w-7xl overflow-hidden rounded-lg"
        style={bannerBackground}
      >
        {/* Blurred artwork background gives each page banner a distinct mood. */}
        <Image
          src={selectedBanner.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover opacity-40 blur-2xl"
          aria-hidden="true"
        />

        {/* Overlay keeps foreground content readable on top of varied posters. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

        {/* Banner content presents the selected page highlight and main action. */}
        <div className="relative z-10 flex h-full items-center justify-between gap-8 px-5 py-6 sm:px-8 lg:px-10">
          <div className="max-w-xl space-y-4 text-white">
            <h1 className="text-3xl font-black sm:text-4xl">
              {selectedBanner.title}
            </h1>
            <p className="text-sm leading-6 text-white/75 sm:text-base">
              {selectedBanner.description}
            </p>

            {/* Dynamic meta adapts the compact detail line by banner type. */}
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              {type === "movie" && selectedBanner.meta?.score ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2 py-1 text-neutral-950">
                  <Star className="h-4 w-4" aria-hidden="true" />
                  {selectedBanner.meta.score}
                </span>
              ) : null}

              {type === "event" && selectedBanner.meta?.date ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-white">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {selectedBanner.meta.date}
                </span>
              ) : null}

              {type === "tour" && selectedBanner.meta?.location ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-white">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {selectedBanner.meta.location}
                </span>
              ) : null}
            </div>

            <Link
              href={selectedBanner.href}
              className="inline-flex rounded-md bg-red-600 px-6 py-3 text-sm font-black text-white transition hover:bg-red-700"
            >
              {selectedBanner.ctaText}
            </Link>
          </div>

          {/* Poster preview anchors the banner visually on larger screens. */}
          <div className="relative hidden h-[450px] w-[300px] shrink-0 overflow-hidden rounded-lg shadow-2xl md:block">
            <Image
              src={selectedBanner.image}
              alt=""
              fill
              sizes="220px"
              className="object-cover"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
