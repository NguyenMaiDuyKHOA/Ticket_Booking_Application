"use client";

import { ArrowRight, CalendarDays, Film, Map, Music2, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Rank } from "@/components/rank";
import { Searchbar } from "@/components/searchbar";
import { HeroSlider } from "@/components/hero-slider";

const ticketCategories = [
  {
    id: "cgv",
    href: "/cgv",
    icon: Film,
    className: "bg-red-50 text-red-800",
  },
  {
    id: "event",
    href: "/event",
    icon: Ticket,
    className: "bg-teal-50 text-teal-800",
  },
  {
    id: "concert",
    href: "/concert",
    icon: Music2,
    className: "bg-amber-50 text-amber-800",
  },
  {
    id: "tour",
    href: "/tour",
    icon: Map,
    className: "bg-neutral-100 text-neutral-800",
  },
] as const;

// Renders the Home page where users discover ticket categories and rankings.
export function HomeExperience() {
  const t = useTranslations("Home");

  return (
    <>
      <Navbar variant="home" />

      {/* Header */}
      <HeroSlider />
      <Searchbar variant="home" />

      {/* Body */}
      <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* RIGHT */}
        <main className="min-w-0">
          {/* Ticket category cards provide the main Home discovery surface. */}
          <section id="ticket-types" className="bg-background">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {t("categories.title")}
                </h2>
                <p className="mt-1 text-sm text-zinc-100">
                  {t("categories.subtitle")}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {ticketCategories.map((category) => {
                const Icon = category.icon;
                const title = t(`categories.${category.id}.title`);

                return (
                  <Link
                    key={category.id}
                    href={category.href}
                    className="rounded-lg border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-400"
                  >
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-md ${category.className}`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-neutral-950">
                      {title}
                    </h3>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600">
                      {t(`categories.${category.id}.description`)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-red-700">
                      {t(`categories.${category.id}.cta`)}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Featured blocks summarize common buying moments below categories. */}
          <section id="featured" className="mt-8 border-t border-black/10 pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {["today", "weekend", "family"].map((deal) => (
                <div
                  key={deal}
                  className="rounded-lg border border-black/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sm font-black text-neutral-950">
                    <CalendarDays
                      className="h-4 w-4 text-red-700"
                      aria-hidden="true"
                    />
                    {t(`featured.${deal}.title`)}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {t(`featured.${deal}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* LEFT */}
        <aside className="w-full md:w-[320px] md:sticky md:top-24 self-start">
          {/* Home Rank stays on the right side directly below Searchbar. */}
          <Rank type="home" />
        </aside>
      </div>

      <Footer />
    </>
  );
}
