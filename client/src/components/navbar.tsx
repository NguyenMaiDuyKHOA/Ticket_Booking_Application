"use client";

import Image from "next/image";
import { Film } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

import { FilterDropdown } from "./filter-dropdown";
import { UserMenu } from "./user-menu";

type NavbarProps = {
  variant?: "booking" | "default" | "home";
};

// Renders the shared navigation bar with localized links and utility actions.
export function Navbar({ variant = "default" }: NavbarProps = {}) {
  const t = useTranslations("Home");
  const pathname = usePathname();
  const isHomePage = pathname === "/" || variant === "home";
  const ticketTypeOptions = [
    { href: "/cgv", label: "CGV", value: "cgv" },
    { href: "/event", label: "Event", value: "event" },
    { href: "/concert", label: "Concert", value: "concert" },
    { href: "/tour", label: "Tour", value: "tour" },
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
          {!isHomePage && (
            <Link href="/" className="hover:text-neutral-950">
              {t("nav.home")}
            </Link>
          )}
          
          <FilterDropdown
            label={t("nav.ticketTypes")}
            menuClassName="min-w-44"
            options={ticketTypeOptions}
            variant="nav"
          />

          <a href="" className="hover:text-neutral-950">{t("nav.search")}</a>
          <a href="" className="hover:text-neutral-950">{t("nav.featured")}</a>
          <a href="" className="hover:text-neutral-950">{t("nav.support")}</a>


          {/* {navItems
            .filter((item) => variant !== "home" || item.labelKey !== "nav.ticketTypes")
            .map((item) => (
              <a key={item.href} className="hover:text-neutral-950" href={item.href}>
                {t(item.labelKey)}
              </a>
            ))} */}
        </nav>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-5">
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
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
