"use client";

import { useEffect, useMemo, useState } from "react";

type PaletteSwatch = {
  hex: string;
  population: number;
  titleTextColor: string;
  bodyTextColor: string;
};

type DominantColorValue = {
  hex: string;
  titleTextColor: string;
  bodyTextColor: string;
};

type DominantColorState = DominantColorValue & {
  isLoading: boolean;
};

type UseDominantColorOptions = {
  fallbackColor?: string;
  fallbackTitleTextColor?: string;
  fallbackBodyTextColor?: string;
};

const DEFAULT_COLOR = "#181716";
const DEFAULT_TEXT_COLOR = "#ffffff";
const swatchPriority = [
  "Vibrant",
  "DarkVibrant",
  "Muted",
  "DarkMuted",
  "LightVibrant",
  "LightMuted",
];
const colorCache = new Map<string, DominantColorValue>();

// Selects a stable palette color while preferring saturated poster tones.
function pickPosterSwatch(palette: Record<string, PaletteSwatch | null>) {
  const priorityMatch = swatchPriority
    .map((name) => palette[name])
    .find((swatch): swatch is PaletteSwatch => Boolean(swatch));

  if (priorityMatch) {
    return priorityMatch;
  }

  return Object.values(palette)
    .filter((swatch): swatch is PaletteSwatch => Boolean(swatch))
    .sort((first, second) => second.population - first.population)[0];
}

// Extracts the dominant color from a same-origin or CORS-enabled image.
export function useDominantColor(
  imageSrc?: string,
  options: UseDominantColorOptions = {},
) {
  const fallback = useMemo<DominantColorValue>(
    () => ({
      hex: options.fallbackColor ?? DEFAULT_COLOR,
      titleTextColor: options.fallbackTitleTextColor ?? DEFAULT_TEXT_COLOR,
      bodyTextColor: options.fallbackBodyTextColor ?? DEFAULT_TEXT_COLOR,
    }),
    [
      options.fallbackBodyTextColor,
      options.fallbackColor,
      options.fallbackTitleTextColor,
    ],
  );

  const [dominantColor, setDominantColor] = useState<DominantColorState>({
    ...fallback,
    isLoading: false,
  });

  useEffect(() => {
    let isMounted = true;

    if (!imageSrc) {
      setDominantColor({ ...fallback, isLoading: false });
      return () => {
        isMounted = false;
      };
    }

    const source = imageSrc;
    const cachedColor = colorCache.get(source);

    if (cachedColor) {
      setDominantColor({ ...cachedColor, isLoading: false });
      return () => {
        isMounted = false;
      };
    }

    setDominantColor((currentColor) => ({
      ...currentColor,
      isLoading: true,
    }));

    async function extractColor() {
      try {
        const { Vibrant } = await import("node-vibrant/browser");
        const palette = await Vibrant.from(source)
          .quality(5)
          .maxDimension(180)
          .getPalette();
        const swatch = pickPosterSwatch(palette);
        const nextColor = swatch
          ? {
              hex: swatch.hex,
              titleTextColor: swatch.titleTextColor,
              bodyTextColor: swatch.bodyTextColor,
            }
          : fallback;

        colorCache.set(source, nextColor);

        if (isMounted) {
          setDominantColor({ ...nextColor, isLoading: false });
        }
      } catch {
        if (isMounted) {
          setDominantColor({ ...fallback, isLoading: false });
        }
      }
    }

    extractColor();

    return () => {
      isMounted = false;
    };
  }, [fallback, imageSrc]);

  return dominantColor;
}
