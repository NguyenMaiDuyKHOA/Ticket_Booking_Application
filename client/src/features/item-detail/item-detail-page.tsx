import Image from "next/image";
import { CalendarDays, ChevronLeft, Clock3, MapPin, Star, Ticket } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Link } from "@/i18n/navigation";

import type { ItemDetail } from "./item-detail-data";

type ItemDetailPageProps = {
  item: ItemDetail;
};

// Renders one reusable detail layout for movie, event, concert, and tour items.
export async function ItemDetailPage({ item }: ItemDetailPageProps) {
  const t = await getTranslations("ItemDetail");

  return (
    <>
      <Navbar variant={item.type === "cgv" ? "booking" : "home"} />

      <main className="min-h-screen bg-background text-foreground">
        {/* Hero section presents the selected item with shared metadata. */}
        <section className="border-b border-black/10 bg-neutral-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-900 shadow-2xl">
              <Image
                src={item.image}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 360px, 100vw"
                className="object-cover"
                aria-hidden="true"
              />
            </div>

            <div className="flex min-w-0 flex-col justify-center">
              <Link
                href={item.type === "cgv" ? "/cgv" : "/"}
                className="inline-flex w-fit items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-black text-neutral-100 transition hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                {t("back")}
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-black">
                <span className="rounded-md bg-red-700 px-3 py-1 text-white">
                  {t(`types.${item.type}`)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-300 px-3 py-1 text-neutral-950">
                  <Star className="h-4 w-4" aria-hidden="true" />
                  {item.score}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
                {item.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-neutral-200">
                {item.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-neutral-200">
                <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                  <Ticket className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  {item.genre}
                </span>
                {item.duration ? (
                  <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                    <Clock3 className="h-4 w-4 text-amber-300" aria-hidden="true" />
                    {item.duration}
                  </span>
                ) : null}
                {item.location ? (
                  <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                    <MapPin className="h-4 w-4 text-amber-300" aria-hidden="true" />
                    {item.location}
                  </span>
                ) : null}
                {item.format ? (
                  <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                    <CalendarDays className="h-4 w-4 text-amber-300" aria-hidden="true" />
                    {item.format}
                  </span>
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={item.ctaHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber-400 px-5 text-sm font-black text-neutral-950 transition hover:bg-amber-300"
                >
                  {t("primaryCta")}
                </Link>
                <span className="text-sm font-black text-amber-200">
                  {item.priceLabel}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Body section keeps reusable details scannable for every item type. */}
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <article className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-neutral-950">
              {t("overview")}
            </h2>
            <p className="mt-3 text-base leading-8 text-neutral-600">
              {item.summary}
            </p>
          </article>

          <aside className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-neutral-950">
              {t("details")}
            </h2>
            <div className="mt-4 grid gap-3">
              {item.facts.map((fact) => (
                <div
                  key={`${fact.label}-${fact.value}`}
                  className="rounded-md border border-black/10 bg-neutral-50 p-3"
                >
                  <p className="text-xs font-black uppercase tracking-wide text-neutral-500">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-sm font-black text-neutral-950">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
