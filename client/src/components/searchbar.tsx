"use client";

import { CalendarDays, Film, MapPin, Search, Ticket, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { FilterDropdown, type FilterDropdownOption } from "./filter-dropdown";

type SearchbarProps = {
  variant?: "home" | "cgv" | "event" | "concert" | "tour" | "admin";
};

const locationOptions: FilterDropdownOption[] = [
  { label: "Vietnam", value: "vietnam" },
  { label: "Ho Chi Minh City", value: "ho-chi-minh-city" },
  { label: "Ha Noi", value: "ha-noi" },
];

const cityOptions: FilterDropdownOption[] = [
  { label: "Ho Chi Minh City", value: "ho-chi-minh-city" },
  { label: "Ha Noi", value: "ha-noi" },
  { label: "Da Nang", value: "da-nang" },
];

const cinemaOptions: FilterDropdownOption[] = [
  { label: "Galaxy Nguyen Du", value: "galaxy-nguyen-du" },
  { label: "CGV Vincom Dong Khoi", value: "cgv-vincom-dong-khoi" },
  { label: "Lotte Cinema Nam Sai Gon", value: "lotte-nam-sai-gon" },
];

export function Searchbar({ variant = "cgv" }: SearchbarProps) {
  const bookingT = useTranslations("Booking");
  const homeT = useTranslations("Home");
  const [ticketType, setTicketType] = useState("all");
  const [location, setLocation] = useState("vietnam");
  const [movieType, setMovieType] = useState("all");
  const [city, setCity] = useState("ho-chi-minh-city");
  const [cinema, setCinema] = useState("galaxy-nguyen-du");
  const [date, setDate] = useState("today");

  if (variant === "home") {
    const ticketTypeOptions: FilterDropdownOption[] = [
      { label: homeT("search.allCategories"), value: "all" },
      { href: "/cgv", label: homeT("categories.cgv.title"), value: "cgv" },
      { href: "/event", label: homeT("categories.event.title"), value: "event" },
      { href: "/concert", label: homeT("categories.concert.title"), value: "concert" },
      { href: "/tour", label: homeT("categories.tour.title"), value: "tour" },
    ];

    return (
      <section id="search" className="border-b border-black/10 bg-[#f0ede8]">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_auto] lg:px-8">
          <label className="rounded-lg border border-black/10 bg-white px-3 py-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
              <Search className="h-4 w-4 text-red-700" aria-hidden="true" />
              {homeT("search.keyword")}
            </span>
            <input
              type="search"
              placeholder={homeT("search.keywordPlaceholder")}
              className="mt-1 w-full bg-transparent text-sm font-bold text-neutral-950 outline-none placeholder:text-neutral-400"
            />
          </label>

          <FilterDropdown
            accentClassName="text-teal-700"
            className="rounded-lg border border-black/10 bg-white px-3 py-2"
            icon={Ticket}
            label={homeT("search.category")}
            onChange={setTicketType}
            options={ticketTypeOptions}
            value={ticketType}
          />

          <FilterDropdown
            accentClassName="text-amber-700"
            className="rounded-lg border border-black/10 bg-white px-3 py-2"
            icon={MapPin}
            label={homeT("search.location")}
            onChange={setLocation}
            options={locationOptions}
            value={location}
          />

          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-800">
            <Search className="h-4 w-4" aria-hidden="true" />
            {homeT("search.button")}
          </button>
        </div>
      </section>
    );
  }

  const t = bookingT;
  const movieTypeOptions: FilterDropdownOption[] = [
    { label: t("search.movieTypes.all"), value: "all" },
    { label: t("search.movieTypes.action"), value: "action" },
    { label: t("search.movieTypes.drama"), value: "drama" },
    { label: t("search.movieTypes.family"), value: "family" },
  ];
  const dateOptions: FilterDropdownOption[] = [
    { label: t("dates.today"), value: "today" },
    { label: t("dates.tomorrow"), value: "tomorrow" },
    { label: t("dates.weekend"), value: "weekend" },
  ];

  return (
    <section className="border-b border-black/10 bg-[#f0ede8]">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:px-6 md:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:px-8">
        <FilterDropdown
          accentClassName="text-red-700"
          className="rounded-lg border border-black/10 bg-white px-3 py-2"
          icon={Film}
          label={t("search.movieType")}
          onChange={setMovieType}
          options={movieTypeOptions}
          value={movieType}
        />

        <FilterDropdown
          accentClassName="text-red-700"
          className="rounded-lg border border-black/10 bg-white px-3 py-2"
          icon={MapPin}
          label={t("search.city")}
          onChange={setCity}
          options={cityOptions}
          value={city}
        />

        <FilterDropdown
          accentClassName="text-teal-700"
          className="rounded-lg border border-black/10 bg-white px-3 py-2"
          icon={Users}
          label={t("search.cinema")}
          onChange={setCinema}
          options={cinemaOptions}
          value={cinema}
        />

        <FilterDropdown
          accentClassName="text-amber-700"
          className="rounded-lg border border-black/10 bg-white px-3 py-2"
          icon={CalendarDays}
          label={t("search.date")}
          onChange={setDate}
          options={dateOptions}
          value={date}
        />

        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-800">
          <Search className="h-4 w-4" aria-hidden="true" />
          {t("search.button")}
        </button>
      </div>
    </section>
  );
}
