"use client";

import {
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  Ticket,
  Utensils,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Banner } from "@/components/banner";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { MovieCard } from "@/components/movie-card";
import { Rank } from "@/components/rank";
import { Searchbar } from "@/components/searchbar";

type MovieId = "orbit" | "saigon" | "midnight" | "thewind";
type DateId = "today" | "tomorrow" | "weekend";
type ComboId = "popcorn" | "soda";
type BannerId = "movie-1" | "event-1";

type Movie = {
  id: MovieId;
  title: string;
  genre: string;
  duration: string;
  age: string;
  format: string;
  score: string;
  basePrice: number;
  posterImage: string;
};

type Combo = {
  id: ComboId;
  title: string;
  description: string;
  price: number;
};

type BannerItem = {
  id: string;

  title: string;
  description: string;

  image: string;
  fallbackColor: string;

  ctaText: string;
  href: string;

  meta?: {
    score?: number;     // movie
    date?: string;      // event
    location?: string;  // tour
  };
};

const dateIds: DateId[] = ["today", "tomorrow", "weekend"];
const showTimes = ["10:30", "13:45", "16:20", "19:30", "22:10"];
const seatRows = ["A", "B", "C", "D", "E", "F"];
const unavailableSeats = new Set(["A3", "A4", "B7", "C2", "C6", "D4", "F1"]);

// Renders the CGV booking page with movie selection, seats, combos, and checkout.
export function BookingExperience() {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const [selectedMovieId] = useState<MovieId>("orbit");
  const selectedBannerId: BannerId = "event-1";
  const [selectedDate, setSelectedDate] = useState<DateId>("today");
  const [selectedTime, setSelectedTime] = useState("19:30");
  const [selectedSeats, setSelectedSeats] = useState(["E4", "E5"]);
  const [comboQty, setComboQty] = useState<Record<ComboId, number>>({
    popcorn: 1,
    soda: 0,
  });

  const banners: BannerItem[] = [
    {
      id: "movie-1",
      title: "Avengers",
      description: "Epic Marvel movie",
      image: "/Poster/Thor_poster_cgv.jpg",
      fallbackColor: "#111827",
      ctaText: "Book Now",
      href: "/movies/1",
      meta: { score: 8.5 }
    },
    {
      id: "event-1",
      title: "Music Festival",
      description: "Live concert night",
      image: "/Poster/Zoologico_poster.jpg",
      fallbackColor: "#7c3aed",
      ctaText: "Get Ticket",
      href: "/events/1",
      meta: { date: "20/05" }
    }
  ];

  const movies: Movie[] = [
    {
      id: "orbit",
      title: t("movies.orbit.title"),
      genre: t("movies.orbit.genre"),
      duration: t("movies.orbit.duration"),
      age: t("movies.orbit.age"),
      format: t("movies.orbit.format"),
      score: "4.8",
      basePrice: 115000,
      posterImage: "/Poster/Perfume_poster.jpg",
    },
    {
      id: "saigon",
      title: t("movies.saigon.title"),
      genre: t("movies.saigon.genre"),
      duration: t("movies.saigon.duration"),
      age: t("movies.saigon.age"),
      format: t("movies.saigon.format"),
      score: "4.6",
      basePrice: 95000,
      posterImage: "/Poster/Premonicao5_Poster.jpg",
    },
    {
      id: "midnight",
      title: t("movies.midnight.title"),
      genre: t("movies.midnight.genre"),
      duration: t("movies.midnight.duration"),
      age: t("movies.midnight.age"),
      format: t("movies.midnight.format"),
      score: "4.7",
      basePrice: 125000,
      posterImage: "/Poster/Thor_poster_cgv.jpg",
    },
    {
      id: "thewind",
      title: t("movies.thewind.title"),
      genre: t("movies.thewind.genre"),
      duration: t("movies.thewind.duration"),
      age: t("movies.thewind.age"),
      format: t("movies.thewind.format"),
      score: "4.7",
      basePrice: 125000,
      posterImage: "/Poster/Zoologico_poster.jpg",
    },
  ];

  const combos: Combo[] = [
    {
      id: "popcorn",
      title: t("combos.popcorn.title"),
      description: t("combos.popcorn.description"),
      price: 79000,
    },
    {
      id: "soda",
      title: t("combos.soda.title"),
      description: t("combos.soda.description"),
      price: 55000,
    },
  ];

  const selectedMovie =
    movies.find((movies) => movies.id === selectedMovieId) ?? movies[0];

  const selectedBanner =
    banners.find((banners) => banners.id === selectedBannerId) ?? banners[0];

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const ticketTotal = selectedMovie.basePrice * selectedSeats.length;
  const comboTotal = combos.reduce(
    (total, combo) => total + combo.price * comboQty[combo.id],
    0,
  );
  const serviceFee = selectedSeats.length > 0 ? 12000 : 0;
  const grandTotal = ticketTotal + comboTotal + serviceFee;

  // Toggles a seat unless it is already unavailable.
  function toggleSeat(seat: string) {
    if (unavailableSeats.has(seat)) {
      return;
    }

    setSelectedSeats((currentSeats) =>
      currentSeats.includes(seat)
        ? currentSeats.filter((currentSeat) => currentSeat !== seat)
        : [...currentSeats, seat],
    );
  }

  // Updates combo quantity while preventing negative values.
  function updateCombo(id: ComboId, direction: 1 | -1) {
    setComboQty((currentQty) => ({
      ...currentQty,
      [id]: Math.max(0, currentQty[id] + direction),
    }));
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground">
        <Banner type="event" selectedBanner={selectedBanner} />
        <Searchbar variant="cgv" />

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
          {/* Movie Showtimes Section */}
          <section id="movies" className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-neutral-950">
                  {t("movies.title")}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {t("movies.subtitle")}
                </p>
              </div>
              <div className="inline-flex rounded-lg border border-black/10 bg-white p-1">
                {dateIds.map((dateId) => {
                  const label = t(`dates.${dateId}`);
                  const isActive = selectedDate === dateId;

                  return (
                    <button
                      key={dateId}
                      type="button"
                      aria-label={t("aria.selectDate", { date: label })}
                      aria-pressed={isActive}
                      onClick={() => setSelectedDate(dateId)}
                      className={`rounded-md px-3 py-2 text-sm font-bold transition ${isActive
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {movies.map((movie) => {
                const isActive = movie.id === selectedMovieId;

                return (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    genre={movie.genre}
                    duration={movie.duration}
                    age={movie.age}
                    format={movie.format}
                    score={movie.score}
                    posterImage={movie.posterImage}
                    isActive={isActive}
                    ariaLabel={t("aria.selectMovie", { movie: movie.title })}
                    href={`/cgv/${movie.id}`}
                  />
                );
              })}
            </div>
          </section>

          <div className="grid gap-4 lg:self-start">
            {/* CGV Rank highlights the top movies for this category page. */}
            <Rank type="cgv" />

            {/* Booking Panel */}
            <aside
              id="schedule"
              className="rounded-lg border border-black/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-neutral-950">
                    {t("bookingPanel.title")}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {t("bookingPanel.subtitle")}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-black text-red-800">
                  <Ticket className="h-4 w-4" aria-hidden="true" />
                  {selectedMovie.format}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-black/10 bg-neutral-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                    {t("bookingPanel.date")}
                  </p>
                  <p className="mt-1 text-sm font-black text-neutral-950">
                    {t(`dates.${selectedDate}`)}
                  </p>
                </div>
                <div className="rounded-lg border border-black/10 bg-neutral-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                    {t("bookingPanel.time")}
                  </p>
                  <p className="mt-1 text-sm font-black text-neutral-950">
                    {selectedTime}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {showTimes.map((time) => {
                  const isActive = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      aria-label={t("aria.selectTime", { time })}
                      aria-pressed={isActive}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-md border px-3 py-2 text-sm font-black transition ${isActive
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-black/10 bg-white text-neutral-700 hover:bg-neutral-100"
                        }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-black text-neutral-950">
                    {t("bookingPanel.seatMap")}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-3 w-3 rounded-sm border border-black/20 bg-white" />
                      {t("bookingPanel.available")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-3 w-3 rounded-sm bg-red-700" />
                      {t("bookingPanel.selected")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-3 w-3 rounded-sm bg-neutral-300" />
                      {t("bookingPanel.taken")}
                    </span>
                  </div>
                </div>

                <div className="mb-4 h-2 rounded-md bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
                <p className="-mt-2 mb-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                  {t("bookingPanel.screen")}
                </p>

                <div className="space-y-2 overflow-x-auto pb-1">
                  {seatRows.map((row) => (
                    <div
                      key={row}
                      className="grid min-w-[316px] grid-cols-[24px_repeat(8,32px)] items-center gap-2"
                    >
                      <span className="text-xs font-black text-neutral-500">
                        {row}
                      </span>
                      {Array.from({ length: 8 }, (_, index) => {
                        const seat = `${row}${index + 1}`;
                        const isUnavailable = unavailableSeats.has(seat);
                        const isSelected = selectedSeats.includes(seat);

                        return (
                          <button
                            key={seat}
                            type="button"
                            disabled={isUnavailable}
                            aria-label={t("aria.selectSeat", { seat })}
                            aria-pressed={isSelected}
                            onClick={() => toggleSeat(seat)}
                            className={`h-8 w-8 rounded-md text-xs font-black transition ${isUnavailable
                              ? "cursor-not-allowed bg-neutral-300 text-neutral-400"
                              : isSelected
                                ? "bg-red-700 text-white"
                                : "border border-black/10 bg-white text-neutral-700 hover:border-teal-700 hover:bg-teal-50"
                              }`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div id="combos" className="mt-6 border-t border-black/10 pt-5">
                <h3 className="flex items-center gap-2 text-sm font-black text-neutral-950">
                  <Utensils className="h-4 w-4 text-amber-700" aria-hidden="true" />
                  {t("combos.title")}
                </h3>
                <div className="mt-3 space-y-3">
                  {combos.map((combo) => (
                    <div
                      key={combo.id}
                      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-black/10 bg-neutral-50 p-3"
                    >
                      <div>
                        <p className="text-sm font-black text-neutral-950">
                          {combo.title}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {combo.description} - {money.format(combo.price)}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={t("aria.decreaseCombo", { combo: combo.title })}
                          onClick={() => updateCombo(combo.id, -1)}
                          className="grid h-8 w-8 place-items-center rounded-md border border-black/10 bg-white text-neutral-700 hover:bg-neutral-100"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="w-5 text-center text-sm font-black">
                          {comboQty[combo.id]}
                        </span>
                        <button
                          type="button"
                          aria-label={t("aria.increaseCombo", { combo: combo.title })}
                          onClick={() => updateCombo(combo.id, 1)}
                          className="grid h-8 w-8 place-items-center rounded-md border border-black/10 bg-white text-neutral-700 hover:bg-neutral-100"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="checkout" className="mt-6 rounded-lg bg-neutral-950 p-4 text-white">
                <h3 className="flex items-center gap-2 text-base font-black">
                  <CreditCard className="h-5 w-5 text-amber-300" aria-hidden="true" />
                  {t("checkout.title")}
                </h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-neutral-300">
                      {t("checkout.tickets")} -{" "}
                      {t("checkout.seatCount", { count: selectedSeats.length })}
                    </span>
                    <span className="font-bold">{money.format(ticketTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-neutral-300">{t("checkout.combo")}</span>
                    <span className="font-bold">{money.format(comboTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-neutral-300">
                      {t("checkout.serviceFee")}
                    </span>
                    <span className="font-bold">{money.format(serviceFee)}</span>
                  </div>
                  <div className="border-t border-white/15 pt-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-black">{t("checkout.total")}</span>
                      <span className="text-xl font-black text-amber-300">
                        {money.format(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={selectedSeats.length === 0}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-400 px-4 py-3 text-sm font-black text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
                >
                  {t("checkout.continue")}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
