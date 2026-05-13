"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { useDominantColor } from "@/hooks/use-dominant-color";
import { Link } from "@/i18n/navigation";
import { createDominantBannerBackground } from "@/lib/color";

type HomeCategoryId = "cgv" | "event" | "concert" | "tour";

type Slide = {
  id: HomeCategoryId;
  href: string;
  image: string;
  fallbackColor: string;
};

// Defines the promotional slides shown on the Home banner.
const slides: Slide[] = [
  {
    id: "cgv",
    href: "/cgv",
    image: "/Poster/Perfume_poster.jpg",
    fallbackColor: "#991b1b",
  },
  {
    id: "event",
    href: "#ticket-types",
    image: "/Poster/Premonicao5_Poster.jpg",
    fallbackColor: "#0f766e",
  },
  {
    id: "concert",
    href: "#ticket-types",
    image: "/Poster/Thor_poster_cgv.jpg",
    fallbackColor: "#b45309",
  },
  {
    id: "tour",
    href: "#ticket-types",
    image: "/Poster/Zoologico_poster.jpg",
    fallbackColor: "#115e59",
  },
];

// Renders an auto-playing promotional carousel for the Home banner.
export function HeroSlider() {
  const t = useTranslations("Home");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const dominantColor = useDominantColor(activeSlide.image, {
    fallbackColor: activeSlide.fallbackColor,
  });
  const sliderBackground = useMemo(
    () => createDominantBannerBackground(dominantColor.hex),
    [dominantColor.hex],
  );

  // Advances the carousel automatically while keeping cleanup local to this UI.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  // Moves the carousel by a direction value while wrapping around the slide list.
  function moveSlide(direction: 1 | -1) {
    setActiveIndex(
      (currentIndex) =>
        (currentIndex + direction + slides.length) % slides.length,
    );
  }

  // Activates a selected slide from the pagination dots.
  function selectSlide(index: number) {
    setActiveIndex(index);
  }

  return (
    <section
      className="relative overflow-hidden border-b border-black/10 bg-neutral-950 transition-colors duration-700"
      style={sliderBackground}
    >
      <div className="relative h-[360px] sm:h-[500px]">
        {/* Slide layers keep dimensions stable while the active slide fades in. */}
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className="mx-auto grid h-full max-w-7xl items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
                {/* Slide copy summarizes the ticket category and primary action. */}
                <div className="max-w-2xl text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                    {t("slider.badge")}
                  </p>
                  <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                    {t(`categories.${slide.id}.title`)}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-white/75">
                    {t(`categories.${slide.id}.description`)}
                  </p>
                  <Link
                    href={slide.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-neutral-950 shadow-sm transition hover:bg-amber-100"
                  >
                    {t(`categories.${slide.id}.cta`)}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                {/* Slide artwork uses existing public assets without changing layout. */}
                <div className="hidden justify-end lg:flex">
                  <div className="relative grid h-[460px] w-[310px] place-items-center rounded-lg border border-white/15 bg-white/10 p-2 shadow-2xl">
                    <Image
                      src={slide.image}
                      alt=""
                      width={300}
                      height={450}
                      priority={index === 0}
                      className="h-[450px] w-[300px] object-contain drop-shadow-2xl"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel controls expose manual navigation without shifting content. */}
        <div className="absolute inset-x-0 bottom-5 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={t("slider.goToSlide", { index: index + 1 })}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => selectSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${isActive ? "w-8 bg-white" : "w-2.5 bg-white/45"
                    }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t("slider.previous")}
              onClick={() => moveSlide(-1)}
              className="grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t("slider.next")}
              onClick={() => moveSlide(1)}
              className="grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
