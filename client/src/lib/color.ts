import type { CSSProperties } from "react";

type Rgb = {
  red: number;
  green: number;
  blue: number;
};

const FALLBACK_HEX = "#181716";

// Converts palette hex values into RGB channels for CSS gradient generation.
function hexToRgb(hex: string): Rgb {
  const normalizedHex = hex.replace("#", "");
  const fullHex =
    normalizedHex.length === 3
      ? normalizedHex
          .split("")
          .map((channel) => channel + channel)
          .join("")
      : normalizedHex;

  if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
    return hexToRgb(FALLBACK_HEX);
  }

  return {
    red: Number.parseInt(fullHex.slice(0, 2), 16),
    green: Number.parseInt(fullHex.slice(2, 4), 16),
    blue: Number.parseInt(fullHex.slice(4, 6), 16),
  };
}

// Blends a poster color with a target tone to keep banner text readable.
function mixHexColors(hex: string, targetHex: string, targetWeight: number) {
  const source = hexToRgb(hex);
  const target = hexToRgb(targetHex);
  const sourceWeight = 1 - targetWeight;

  const toHexChannel = (value: number) =>
    Math.round(value).toString(16).padStart(2, "0");

  return `#${toHexChannel(
    source.red * sourceWeight + target.red * targetWeight,
  )}${toHexChannel(
    source.green * sourceWeight + target.green * targetWeight,
  )}${toHexChannel(source.blue * sourceWeight + target.blue * targetWeight)}`;
}

// Builds the banner background from the dominant poster color.
export function createDominantBannerBackground(hex: string): CSSProperties {
  const deepTone = mixHexColors(hex, "#020617", 0.72);
  const midTone = mixHexColors(hex, "#111827", 0.38);
  const glowTone = mixHexColors(hex, "#ffffff", 0.18);

  return {
    backgroundColor: deepTone,
    backgroundImage: [
      `radial-gradient(circle at 78% 18%, ${glowTone}99 0, transparent 30%)`,
      `radial-gradient(circle at 10% 90%, ${hex}66 0, transparent 28%)`,
      `linear-gradient(135deg, ${deepTone} 0%, ${midTone} 48%, #09090b 100%)`,
    ].join(", "),
  };
}
