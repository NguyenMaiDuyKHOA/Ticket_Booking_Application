import { useTranslations } from "next-intl";

import type { CityOption } from "@/lib/cities-api";
import type { HallTypeOption } from "@/lib/hall-types-api";

import type { AgeRating, CinemaMetadata, EventMetadata } from "@/features/admin/types/item.types";
import { isValidJsonObject } from "@/features/admin/utils/item-form";
import { AdminInput } from "./shared/AdminInput";
import { AdminSelect } from "./shared/AdminSelect";

const ageRatingOptions: AgeRating[] = ["P", "K", "T13", "T16", "T18"];

type ItemMetadataFormProps = {
  areCitiesLoading: boolean;
  areHallTypesLoading: boolean;
  cities: CityOption[];
  citiesErrorMessage: string | null;
  eventMetadata: EventMetadata;
  genericMetadata: string;
  hallTypes: HallTypeOption[];
  hallTypesErrorMessage: string | null;
  itemTypeSlug: string | undefined;
  metadataJson: string;
  onEventMetadataChange: (metadata: EventMetadata) => void;
  onGenericMetadataChange: (metadata: string) => void;
  onCinemaMetadataChange: (metadata: CinemaMetadata) => void;
  cinemaMetadata: CinemaMetadata;
};

export function ItemMetadataForm({
  areCitiesLoading,
  areHallTypesLoading,
  cities,
  citiesErrorMessage,
  eventMetadata,
  genericMetadata,
  hallTypes,
  hallTypesErrorMessage,
  itemTypeSlug,
  metadataJson,
  onEventMetadataChange,
  onGenericMetadataChange,
  onCinemaMetadataChange,
  cinemaMetadata,
}: ItemMetadataFormProps) {
  const t = useTranslations("Admin");

  if (itemTypeSlug === "cinema") {
    return (
      <section className="rounded-md border border-black/10 bg-neutral-50 p-4 md:col-span-2">
        <MetadataHeader description={t("metadata.cinemaDescription")} title={t("metadata.title")} />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <AdminInput
            label={t("metadata.duration")}
            placeholder={t("placeholders.duration")}
            type="number"
            value={cinemaMetadata.duration}
            onChange={(event) => onCinemaMetadataChange({ ...cinemaMetadata, duration: event.target.value })}
          />
          <AdminSelect
            label={t("metadata.ageRating")}
            value={cinemaMetadata.ageRating}
            onChange={(event) => onCinemaMetadataChange({ ...cinemaMetadata, ageRating: event.target.value as AgeRating })}
          >
            {ageRatingOptions.map((ageRating) => (
              <option key={ageRating} value={ageRating}>
                {ageRating}
              </option>
            ))}
          </AdminSelect>
        </div>
        <section className="mt-4 rounded-md border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-neutral-800">{t("metadata.format")}</span>
            {cinemaMetadata.supportedHallTypeIds.length > 0 ? (
              <span className="text-xs font-bold text-red-700">{cinemaMetadata.supportedHallTypeIds.length} selected</span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-semibold text-neutral-500">
            Select the hall formats this item can be scheduled in.
          </p>

          {areHallTypesLoading ? (
            <p className="mt-3 rounded-md bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-500">Loading hall types...</p>
          ) : null}
          {hallTypesErrorMessage ? (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{hallTypesErrorMessage}</p>
          ) : null}
          {!areHallTypesLoading && !hallTypesErrorMessage && hallTypes.length === 0 ? (
            <p className="mt-3 rounded-md bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-500">No hall types.</p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {hallTypes.map((hallType) => {
              const isSelected = cinemaMetadata.supportedHallTypeIds.includes(hallType.id);

              return (
                <label
                  key={hallType.id}
                  className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-bold transition ${
                    isSelected ? "border-red-200 bg-red-700 text-white" : "border-black/10 bg-white text-neutral-700 hover:border-red-200 hover:bg-red-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      const nextHallTypeIds = isSelected
                        ? cinemaMetadata.supportedHallTypeIds.filter((hallTypeId) => hallTypeId !== hallType.id)
                        : [...cinemaMetadata.supportedHallTypeIds, hallType.id];

                      onCinemaMetadataChange({
                        ...cinemaMetadata,
                        format: hallTypes
                          .filter((candidate) => nextHallTypeIds.includes(candidate.id))
                          .map((candidate) => candidate.name)
                          .join(", "),
                        supportedHallTypeIds: nextHallTypeIds,
                      });
                    }}
                    className="sr-only"
                  />
                  {hallType.name}
                </label>
              );
            })}
          </div>
        </section>
        <MetadataPreview metadataJson={metadataJson} />
      </section>
    );
  }

  if (itemTypeSlug === "event") {
    return (
      <section className="rounded-md border border-black/10 bg-neutral-50 p-4 md:col-span-2">
        <MetadataHeader description={t("metadata.eventDescription")} title={t("metadata.title")} />
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-neutral-600">
          <AdminSelect
            label={t("metadata.city")}
            value={eventMetadata.cityId}
            onChange={(event) => onEventMetadataChange({ ...eventMetadata, cityId: event.target.value })}
          >
            <option value="" disabled>
              {areCitiesLoading ? t("cities.loading") : t("cities.empty")}
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </AdminSelect>
          <AdminInput
            label={t("metadata.detailLocation")}
            placeholder={t("placeholders.detailLocation")}
            value={eventMetadata.detailLocation}
            onChange={(event) => onEventMetadataChange({ ...eventMetadata, detailLocation: event.target.value })}
          />
        </div>
        {citiesErrorMessage ? (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{citiesErrorMessage}</p>
        ) : null}
        <MetadataPreview metadataJson={metadataJson} />
      </section>
    );
  }

  return (
    <section className="rounded-md border border-black/10 bg-neutral-50 p-4 md:col-span-2">
      <MetadataHeader description={t("metadata.genericDescription")} title={t("metadata.title")} />
      <label className="mt-4 block">
        <span className="text-sm font-bold text-neutral-800">{t("metadata.json")}</span>
        <textarea
          rows={6}
          value={genericMetadata}
          onChange={(event) => onGenericMetadataChange(event.target.value)}
          placeholder={t("placeholders.metadataJson")}
          className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 font-mono text-sm font-semibold outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />
      </label>
      {!isValidJsonObject(genericMetadata) ? (
        <p className="mt-2 text-xs font-bold text-red-700">{t("metadata.invalidJson")}</p>
      ) : null}
      <MetadataPreview metadataJson={metadataJson} />
    </section>
  );
}

function MetadataHeader({ description, title }: { description: string; title: string }) {
  return (
    <div>
      <h3 className="text-base font-black text-neutral-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

function MetadataPreview({ metadataJson }: { metadataJson: string }) {
  const t = useTranslations("Admin");

  return (
    <label className="mt-4 block">
      <span className="text-sm font-bold text-neutral-800">{t("metadata.preview")}</span>
      <pre className="mt-2 max-h-64 overflow-auto rounded-md border border-black/10 bg-white p-4 text-xs font-semibold leading-6 text-neutral-700">
        {metadataJson}
      </pre>
    </label>
  );
}
