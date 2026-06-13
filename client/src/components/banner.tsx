"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Star } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { createDominantBannerBackground } from "@/lib/color";

/**
 * Each category has its own visual language:
 *
 * - movie:
 *   Cinematic, portrait poster focused, darker atmosphere.
 *
 * - concert/event:
 *   Energetic, wide hero image, live experience focused.
 */
export type BannerType = "movie" | "concert" | "event";

type BannerItem = {
    id: string;
    title: string;
    description: string;

    /**
     * Main visual shown inside the banner.
     *
     * For movies:
     * - usually a portrait poster
     *
     * For concerts/events:
     * - usually a landscape hero image
     */
    image: string;

    /**
     * Fallback used before dominant color extraction finishes.
     */
    fallbackColor: string;

    ctaText: string;
    href: string;

    meta?: {
        score?: number;
        date?: string;
        location?: string;
    };
};

type FeatureBannerProps = {
    type: BannerType;
    item: BannerItem;
};

/**
 * Shared reusable feature banner.
 *
 * The component adapts its layout depending on content type:
 *
 * - movie:
 *   Poster-oriented cinematic layout.
 *
 * - concert/event:
 *   Landscape immersive hero layout.
 */
export function FeatureBanner({
    type,
    item,
}: FeatureBannerProps) {
    const dominantColor = useDominantColor(item.image, {
        fallbackColor: item.fallbackColor,
    });

    const backgroundStyle = createDominantBannerBackground(
        dominantColor.hex,
    );

    const isMovie = type === "movie";
    const isEventExperience =
        type === "concert" || type === "event";

    return (
        <section className="bg-neutral-950 px-4 py-6 sm:px-6 lg:px-8">
            <div
                className={cn(
                    "relative mx-auto max-w-7xl overflow-hidden rounded-3xl",
                    isMovie ? "aspect-[21/9]" : "aspect-[21/8]",
                )}
                style={backgroundStyle}
            >
                {/* 
                    Background artwork layer.
                    
                    This creates atmosphere and visual identity
                    without competing against foreground content.
                */}
                <Image
                    src={item.image}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className={cn(
                        "object-cover",
                        isMovie
                            ? "scale-110 opacity-40 blur-2xl"
                            : "opacity-50 blur-xl",
                    )}
                    aria-hidden="true"
                />

                {/* 
                    Readability overlay.
                    
                    Stronger darkness on movie pages
                    for a more cinematic feeling.
                */}
                <div
                    className={cn(
                        "absolute inset-0",
                        isMovie
                            ? "bg-gradient-to-r from-black via-black/70 to-transparent"
                            : "bg-gradient-to-r from-black/90 via-black/60 to-black/20",
                    )}
                />

                {/* 
                    Main content container.
                    
                    Layout changes depending on experience type:
                    
                    - movie:
                        text + portrait poster
                    
                    - concert/event:
                        immersive wide hero
                */}
                <div className="relative z-10 flex h-full items-center">
                    {/*
                        =========================================================
                        MOVIE LAYOUT
                        =========================================================
                    */}
                    {isMovie ? (
                        <div className="flex w-full items-center justify-between gap-10 px-6 py-8 sm:px-10">
                            {/* Left content */}
                            <div className="max-w-xl text-white">
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                    {item.meta?.score ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-sm font-black text-black">
                                            <Star className="h-4 w-4 fill-current" />
                                            {item.meta.score}
                                        </span>
                                    ) : null}
                                </div>

                                <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                                    {item.title}
                                </h1>

                                <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
                                    {item.description}
                                </p>

                                <div className="mt-8">
                                    <Link
                                        href={item.href}
                                        className="
                                        inline-flex items-center rounded-xl
                                        bg-red-600 px-6 py-3 text-sm
                                        font-black text-white
                                        transition hover:bg-red-700
                                        "
                                    >
                                        {item.ctaText}
                                    </Link>
                                </div>
                            </div>

                            {/* 
                                Portrait poster preview.
                                
                                Movies psychologically feel more familiar
                                with vertical poster compositions.
                            */}
                            <div className="relative hidden h-[460px] w-[300px] shrink-0 overflow-hidden rounded-2xl shadow-2xl lg:block">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="300px"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    ) : null}

                    {/*
                        =========================================================
                        EVENT / CONCERT LAYOUT
                        ========================================================= 
                    */}
                    {isEventExperience ? (
                        <div className="relative flex h-full w-full items-end">
                            {/* 
                Large landscape artwork.
                
                Events should feel alive and immersive,
                not like static posters.
              */}
                            <div className="absolute inset-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                />
                            </div>

                            {/* Extra dark overlay for readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            {/* Foreground content */}
                            <div className="relative z-10 w-full p-6 text-white sm:p-10">
                                <div className="mb-4 flex flex-wrap gap-3">
                                    {item.meta?.date ? (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md">
                                            <CalendarDays className="h-4 w-4" />
                                            {item.meta.date}
                                        </span>
                                    ) : null}

                                    {item.meta?.location ? (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md">
                                            <MapPin className="h-4 w-4" />
                                            {item.meta.location}
                                        </span>
                                    ) : null}
                                </div>

                                <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                                    {item.title}
                                </h1>

                                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                    {item.description}
                                </p>

                                <div className="mt-8">
                                    <Link
                                        href={item.href}
                                        className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-white/90"
                                    >
                                        {item.ctaText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}