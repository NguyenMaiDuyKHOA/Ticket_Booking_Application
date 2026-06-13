"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { useDominantColor } from "@/hooks/use-dominant-color";
import { Link } from "@/i18n/navigation";
import { createDominantBannerBackground } from "@/lib/color";
import { getItems, type ItemResponse } from "@/lib/items-api";

type HomeCategoryId = "cgv" | "event" | "concert" | "tour";

type Slide = {
  id: HomeCategoryId;
  description?: string;
  href: string;
  image: string;
  fallbackColor: string;
  title?: string;
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
    href: "/event",
    image: "/Poster/Premonicao5_Poster.jpg",
    fallbackColor: "#0f766e",
  },
  {
    id: "concert",
    href: "/concert",
    image: "/Poster/Thor_poster_cgv.jpg",
    fallbackColor: "#b45309",
  },
  {
    id: "tour",
    href: "/tour",
    image: "/Poster/Zoologico_poster.jpg",
    fallbackColor: "#115e59",
  },
];

const fallbackImage = "/Poster/Perfume_poster.jpg";

// Renders an auto-playing promotional carousel for the Home banner.
export function HeroSlider() {
  const t = useTranslations("Home");
  const [dynamicSlides, setDynamicSlides] = useState<Slide[]>(slides);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlides = dynamicSlides.length > 0 ? dynamicSlides : slides;
  const activeSlide = activeSlides[activeIndex] ?? activeSlides[0] ?? slides[0];
  const dominantColor = useDominantColor(activeSlide.image, {
    fallbackColor: activeSlide.fallbackColor,
  });
  const sliderBackground = useMemo(
    () => createDominantBannerBackground(dominantColor.hex),
    [dominantColor.hex],
  );

  useEffect(() => {
    let isMounted = true;

    getItems({ page: 1, pageSize: 8, statusSlug: "published" })
      .then((result) => {
        if (!isMounted) {
          return;
        }

        const nextSlides = result.items
          .map(toSlide)
          .filter((slide): slide is Slide => Boolean(slide))
          .slice(0, 5);

        if (nextSlides.length > 0) {
          setDynamicSlides(nextSlides);
          setActiveIndex(0);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDynamicSlides(slides);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Advances the carousel automatically while keeping cleanup local to this UI.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % activeSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeSlides.length]);

  // Moves the carousel by a direction value while wrapping around the slide list.
  function moveSlide(direction: 1 | -1) {
    setActiveIndex(
      (currentIndex) =>
        (currentIndex + direction + activeSlides.length) % activeSlides.length,
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
        {activeSlides.map((slide, index) => {
          const isActive = index === activeIndex;
          const title = slide.title ?? t(`categories.${slide.id}.title`);
          const description = slide.description ?? t(`categories.${slide.id}.description`);

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ${isActive
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
                }`}
            >
              <div className="mx-auto grid h-full max-w-7xl items-center gap-6 px-12 py-8 sm:px-16 lg:grid-cols-[minmax(0,0.78fr)_minmax(420px,1.22fr)] lg:px-20">
                {/* Slide copy summarizes the ticket category and primary action. */}
                <div className="relative z-10 max-w-2xl text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                    {t("slider.badge")}
                  </p>
                  <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                    {title}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-white/75">
                    {description}
                  </p>
                  <Link
                    href={slide.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-neutral-950 shadow-sm transition hover:bg-amber-100"
                  >
                    {t(`categories.${slide.id}.cta`)}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                <div className="absolute inset-0 opacity-25 lg:hidden">
                  <HeroImage
                    src={slide.image}
                    alt=""
                    priority={index === 0}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="relative z-10 hidden justify-end lg:flex">
                  <div className="relative h-[390px] w-full overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl">
                    <HeroImage
                      src={slide.image}
                      alt={title}
                      priority={index === 0}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel controls expose manual navigation without shifting content. */}
        <button
          type="button"
          aria-label={t("slider.previous")}
          onClick={() => moveSlide(-1)}
          className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur transition hover:bg-black/55 sm:left-6"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={t("slider.next")}
          onClick={() => moveSlide(1)}
          className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur transition hover:bg-black/55 sm:right-6"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="absolute inset-x-0 bottom-5 z-20 mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur">
            {activeSlides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${slide.id}-${slide.href}`}
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
        </div>
      </div>
    </section>
  );
}

function toSlide(item: ItemResponse): Slide | null {
  const routeType = toRouteType(item.itemTypeSlug);

  if (!routeType) {
    return null;
  }

  return {
    id: routeType,
    description: stripHtml(item.description),
    fallbackColor: getFallbackColor(routeType),
    href: `/${routeType}/${item.slug}`,
    image: item.imageUrl || item.posterUrl || fallbackImage,
    title: item.title,
  };
}

function toRouteType(itemTypeSlug: string): HomeCategoryId | null {
  if (itemTypeSlug === "cinema") {
    return "cgv";
  }

  if (itemTypeSlug === "event" || itemTypeSlug === "concert" || itemTypeSlug === "tour") {
    return itemTypeSlug;
  }

  return null;
}

function getFallbackColor(type: HomeCategoryId) {
  return slides.find((slide) => slide.id === type)?.fallbackColor ?? "#181716";
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function HeroImage({
  alt,
  className,
  priority,
  src,
}: {
  alt: string;
  className: string;
  priority?: boolean;
  src: string;
}) {
  if (/^https?:\/\//i.test(src)) {
    // Catalog images can come from Cloudinary or external providers. Native img avoids blocking unknown remote domains.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(min-width: 1024px) 720px, 100vw"
      className={className}
    />
  );
}
