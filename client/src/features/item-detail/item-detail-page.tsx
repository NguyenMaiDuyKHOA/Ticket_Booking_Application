
import Image from "next/image";
import { Badge, CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Monitor, Star, Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Link } from "@/i18n/navigation";
import { sanitizeRichHtml } from "@/lib/html-sanitizer";

import type { ItemDetail } from "./item-detail-data";
import { AgeRatingBadge } from "@/components/ui/age-rating";

type ItemDetailPageProps = {
  item: ItemDetail;
};
const typeMap = {
  cgv: "aspect-[2/3]",
  event: "aspect-video",
  concert: "aspect-video",
  tour: "aspect-[4/3]",
};

const hrefMap = {
  cgv: "/cgv",
  event: "/event",
  concert: "/concert",
  tour: "/tour",
};



// Renders shared item details while allowing event pages to use an editorial hero layout.
export async function ItemDetailPage({ item }: ItemDetailPageProps) {
  const t = await getTranslations("ItemDetail");
  const isRemoteImage = /^https?:\/\//i.test(item.image);
  const isEventDetail = item.type === "event";
  const safeSummaryHtml = sanitizeRichHtml(item.summary);

  const imageContent = (sizes: string) => (
    isRemoteImage ? (
      // Remote catalog URLs are stored from admin input, so detail pages avoid proxying arbitrary hosts through Next's image optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
    ) : (
      <Image
        src={item.image}
        alt=""
        fill
        priority
        sizes={sizes}
        className="object-cover"
        aria-hidden="true"
      />
    )
  );

  const backLink = (
    <Link
      href={hrefMap[item.type]}
      className="inline-flex w-fit items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-black text-neutral-100 transition hover:bg-white/10"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      {t("back")}
    </Link>
  );

  const heroInfo = (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-black">
        <span className="rounded-md bg-red-700 px-3 py-1 text-white">
          {t(`types.${item.type}`)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-300 px-3 py-1 text-neutral-950">
          <Star className="h-4 w-4" aria-hidden="true" />
          {item.score}
        </span>
      </div>

      <h1 className="my-5 text-4xl font-black leading-tight sm:text-5xl">
        {item.title}
      </h1>

      <div className="my-2 flex flex-wrap gap-2 text-sm font-bold text-neutral-200">
        <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 font-bold">
          <Tag className="h-4 w-4 text-amber-300" aria-hidden="true" />
          {item.genres.map((genre) => t(`genres.${genre}`)).join(", ")}
        </span>
      </div>

      <div className="my-3 flex flex-wrap gap-2 text-sm font-bold text-neutral-200">
        {item.startDate ? (
          <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
            <CalendarDays className="h-4 w-4 text-amber-300" aria-hidden="true" />
            {item.startDate}
          </span>
        ) : null}
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
            <Monitor className="h-4 w-4 text-amber-300" aria-hidden="true" />
            {item.format}
          </span>
        ) : null}
      </div>

      {item.age ? (
        <div className="my-2 flex flex-wrap items-center gap-2 text-sm font-bold text-neutral-200">
          <AgeRatingBadge rating={item.age} />
          {t(`ageRatings.${item.age}`)}
        </div>
      ) : null}


      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber-400 px-5 text-sm font-black text-neutral-950 transition hover:bg-amber-300">
          {t("primaryCta")}
        </button>
        <span className="text-sm font-black text-amber-200">
          {item.priceLabel}
        </span>
      </div>
    </>
  );

  return (
    <>
      <Navbar variant={item.type === "cgv" ? "booking" : "home"} />

      <main className="min-h-screen bg-background text-foreground">
        {isEventDetail ? (
          <section className="border-b border-black/10 bg-neutral-950 text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {backLink}

              <div className="relative mt-6 overflow-hidden rounded-[28px] bg-neutral-900 shadow-2xl lg:grid lg:min-h-[430px] lg:grid-cols-[0.38fr_0.62fr]">
                {/* The event hero follows a ticket shape: purchase context stays readable while the artwork remains prominent but controlled. */}
                <div className="relative z-10 flex min-h-[360px] flex-col bg-neutral-800 p-6 sm:p-8 lg:min-h-[430px] lg:border-r-4 lg:border-dashed lg:border-neutral-950">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wide">
                    <span className="rounded-md bg-emerald-500 px-2.5 py-1 text-neutral-950">
                      {t(`types.${item.type}`)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-amber-200">
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.score}
                    </span>
                  </div>

                  <h1 className="mt-6 text-2xl font-black uppercase leading-tight sm:text-3xl">
                    {item.title}
                  </h1>

                  <div className="mt-7 grid gap-5 text-sm font-bold">
                    {item.startDate ? (
                      <div className="flex gap-3">
                        <CalendarDays className="mt-0.5 h-6 w-6 shrink-0 text-white" aria-hidden="true" />
                        <div>
                          <p className="text-base font-black text-emerald-400">
                            {item.startDate}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {item.location ? (
                      <div className="flex gap-3">
                        <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-white" aria-hidden="true" />
                        <div>
                          <p className="font-black text-emerald-400">
                            {t("locationLabel")}
                          </p>
                          <p className="mt-2 leading-relaxed text-neutral-200">
                            {item.location}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-auto border-t border-white/25 pt-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-black text-white">
                        {t("priceFrom")}
                      </span>
                      <span className="text-3xl font-black text-emerald-400">
                        {item.priceLabel}
                      </span>
                      <ChevronRight className="h-6 w-6 text-emerald-400" aria-hidden="true" />
                    </div>

                    <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-emerald-500 px-5 text-sm font-black text-white transition hover:bg-emerald-400">
                      {t("primaryCta")}
                    </button>
                  </div>
                </div>

                <div className="relative min-h-[260px] bg-neutral-900 sm:min-h-[340px] lg:min-h-[430px]">
                  {imageContent("(min-width: 1024px) 760px, 100vw")}
                </div>

                <div className="pointer-events-none absolute left-[38%] top-0 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-950 lg:block" />
                <div className="pointer-events-none absolute bottom-0 left-[38%] hidden h-14 w-14 -translate-x-1/2 translate-y-1/2 rounded-full bg-neutral-950 lg:block" />
              </div>
            </div>
          </section>
        ) : (
          <section className="border-b border-black/10 bg-neutral-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
              <div className={`${typeMap[item.type]} relative overflow-hidden rounded-lg bg-neutral-900 shadow-2xl`}>
                {imageContent("(min-width: 1024px) 360px, 100vw")}
              </div>

              <div className="flex min-w-0 flex-col justify-center">
                {backLink}
                {heroInfo}
              </div>
            </div>
          </section>
        )}

        {/* Body section keeps reusable details scannable for every item type. */}
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <article className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-neutral-950">
              {t("overview")}
            </h2>
            <div
              className="rich-content mt-3 text-neutral-700"
              dangerouslySetInnerHTML={{ __html: safeSummaryHtml }}
            />
          </article>

          <aside className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-neutral-950">
              {t("details")}
            </h2>
            <div className="mt-4 grid gap-3">
              {item.facts
                .filter((fact) => fact.label !== "ageRating")
                .map((fact) => (
                  <div
                    key={`${fact.label}-${fact.value}`}
                    className="rounded-md border border-black/10 bg-neutral-50 p-3"
                  >
                    <p className="text-xs font-black uppercase tracking-wide text-neutral-500">
                      {t(`fact.${fact.label}`)}
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
