"use client";

import {Clock3, Film, Mail, MapPin, Phone} from "lucide-react";
import {useTranslations} from "next-intl";

const footerLinks = [
  {href: "#movies", labelKey: "nav.movies"},
  {href: "#schedule", labelKey: "nav.schedule"},
  {href: "#combos", labelKey: "nav.food"},
  {href: "#checkout", labelKey: "nav.support"},
] as const;

export function Footer() {
  const t = useTranslations("Booking");
  const year = new Date().getFullYear();

  return (
    <footer id="support" className="border-t border-black/10 bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <a href="#movies" className="inline-flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-red-700 text-white">
              <Film className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>{t("brand")}</span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-300">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-neutral-100">
            {t("footer.quickLinks")}
          </h2>
          <nav className="mt-4 grid gap-3 text-sm font-semibold text-neutral-300">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-white">
                {t(link.labelKey)}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-neutral-100">
            {t("footer.contact")}
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-neutral-300">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-300" aria-hidden="true" />
              {t("footer.address")}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-300" aria-hidden="true" />
              {t("footer.hotline")}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-300" aria-hidden="true" />
              {t("footer.email")}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-amber-300" aria-hidden="true" />
              {t("footer.hours")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs font-semibold text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>{t("footer.copyright", {year})}</span>
          <span>{t("footer.payment")}</span>
        </div>
      </div>
    </footer>
  );
}
