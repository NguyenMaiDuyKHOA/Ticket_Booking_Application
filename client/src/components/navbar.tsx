"use client";

import Image from "next/image";
import { Film } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { FilterDropdown } from "./filter-dropdown";
import { LocaleSwitcher } from "./locale-switcher";

type NavbarVariant = "home" | "booking";

// Defines section links for the CGV booking experience.
const bookingNavItems = [
  { href: "#movies", labelKey: "nav.movies" },
  { href: "#schedule", labelKey: "nav.schedule" },
  { href: "#combos", labelKey: "nav.food" },
  { href: "#checkout", labelKey: "nav.support" },
] as const;

// Defines section links for the Home ticket discovery experience.
const homeNavItems = [
  { href: "#ticket-types", labelKey: "nav.ticketTypes" },
  { href: "#search", labelKey: "nav.search" },
  { href: "#featured", labelKey: "nav.featured" },
  { href: "#support", labelKey: "nav.support" },
] as const;

type NavbarProps = {
  variant?: NavbarVariant;
};

// Renders the shared navigation bar with localized links and utility actions.
export function Navbar({ variant = "booking" }: NavbarProps) {
  const t = useTranslations(variant === "home" ? "Home" : "Booking");
  const navItems = variant === "home" ? homeNavItems : bookingNavItems;
  const ticketTypeOptions = [
    { href: "/cgv", label: "CGV", value: "cgv" },
    { href: "#ticket-types", label: "Event", value: "event" },
    { href: "#ticket-types", label: "Concert", value: "concert" },
    { href: "#ticket-types", label: "Tour", value: "tour" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="flex mx-auto max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-red-700">
            <Film className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="text-black">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-neutral-600 md:flex">
          {variant === "home" ? (
            <FilterDropdown
              label={t("nav.ticketTypes")}
              menuClassName="min-w-44"
              options={ticketTypeOptions}
              variant="nav"
            />
          ) : null}

          {navItems
            .filter((item) => variant !== "home" || item.labelKey !== "nav.ticketTypes")
            .map((item) => (
              <a key={item.href} className="hover:text-neutral-950" href={item.href}>
                {t(item.labelKey)}
              </a>
            ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="items-center md:flex gap-5">
            {/* Utility actions reserve space for account and notification flows. */}
            <Link href="#" aria-label={t("nav.notifications")}>
              <Image
                src="/bell.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
                aria-hidden="true"
              />
            </Link>
            <Link href="/login" aria-label={t("nav.account")}>
              <Image
                src="/pesonal.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
