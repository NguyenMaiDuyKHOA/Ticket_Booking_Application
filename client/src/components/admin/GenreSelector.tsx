import { useTranslations } from "next-intl";

import type { GenreOption } from "@/lib/genres-api";

type GenreSelectorProps = {
  areGenresLoading: boolean;
  errorMessage: string | null;
  genres: GenreOption[];
  onGenreToggle: (genreId: string) => void;
  selectedGenreIds: string[];
};

export function GenreSelector({
  areGenresLoading,
  errorMessage,
  genres,
  onGenreToggle,
  selectedGenreIds,
}: GenreSelectorProps) {
  const t = useTranslations("Admin");
  const itemDetailT = useTranslations("ItemDetail");

  return (
    <section className="rounded-md border border-black/10 bg-neutral-50 p-4 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-neutral-800">{t("genres.title")}</span>
        {selectedGenreIds.length > 0 ? (
          <span className="text-xs font-bold text-red-700">{t("genres.selected", { count: selectedGenreIds.length })}</span>
        ) : null}
      </div>

      {areGenresLoading ? (
        <p className="mt-3 rounded-md bg-white px-3 py-2 text-sm font-bold text-neutral-500">{t("genres.loading")}</p>
      ) : null}
      {errorMessage ? (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{errorMessage}</p>
      ) : null}
      {!areGenresLoading && !errorMessage && genres.length === 0 ? (
        <p className="mt-3 rounded-md bg-white px-3 py-2 text-sm font-bold text-neutral-500">{t("genres.empty")}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {genres.map((genre) => {
          const isSelected = selectedGenreIds.includes(genre.id);

          return (
            <label
              key={genre.id}
              className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-bold transition ${isSelected ? "border-red-200 bg-red-700 text-white" : "border-black/10 bg-white text-neutral-700 hover:border-red-200 hover:bg-red-50"
                }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onGenreToggle(genre.id)}
                className="sr-only"
              />
              {itemDetailT(`genres.${genre.slug}`, { fallback: genre.name })}
            </label>
          );
        })}
      </div>
    </section>
  );
}
