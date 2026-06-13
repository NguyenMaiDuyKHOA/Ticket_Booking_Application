import { Film } from "lucide-react";
import { useTranslations } from "next-intl";

import type { CityOption } from "@/lib/cities-api";
import type { GenreOption } from "@/lib/genres-api";
import type { HallTypeOption } from "@/lib/hall-types-api";
import type { ItemStatusOption } from "@/lib/item-statuses-api";
import type { ItemTypeOption } from "@/lib/item-types-api";

import { useItemForm } from "@/hooks/useItemForm";
import { GenreSelector } from "./GenreSelector";
import { ImageUploadField } from "./ImageUploadField";
import { ItemMetadataForm } from "./ItemMetadataForm";
import { RichTextEditor } from "./RichTextEditor";
import { AdminInput } from "./shared/AdminInput";
import { AdminSelect } from "./shared/AdminSelect";

type ItemFormProps = {
  areCitiesLoading: boolean;
  areGenresLoading: boolean;
  areHallTypesLoading: boolean;
  areStatusesLoading: boolean;
  cities: CityOption[];
  citiesErrorMessage: string | null;
  genres: GenreOption[];
  genresErrorMessage: string | null;
  hallTypes: HallTypeOption[];
  hallTypesErrorMessage: string | null;
  itemStatus: ItemStatusOption | null;
  itemStatuses: ItemStatusOption[];
  managedType: ItemTypeOption | null;
  managedTypes: ItemTypeOption[];
  onStatusChange: (status: ItemStatusOption) => void;
  onTypeChange: (type: ItemTypeOption) => void;
  statusErrorMessage: string | null;
  typeErrorMessage: string | null;
  areTypesLoading: boolean;
};

export function ItemForm({
  areCitiesLoading,
  areGenresLoading,
  areHallTypesLoading,
  areStatusesLoading,
  areTypesLoading,
  cities,
  citiesErrorMessage,
  genres,
  genresErrorMessage,
  hallTypes,
  hallTypesErrorMessage,
  itemStatus,
  itemStatuses,
  managedType,
  managedTypes,
  onStatusChange,
  onTypeChange,
  statusErrorMessage,
  typeErrorMessage,
}: ItemFormProps) {
  const t = useTranslations("Admin");
  const activeTypeName = managedType?.name ?? t("types.empty");
  const form = useItemForm({ cities, genres, hallTypes, itemStatus, managedType });

  return (
    <section className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-neutral-950">{t("add.typeTitle")}</h2>
        {areTypesLoading ? (
          <p className="mt-3 rounded-md bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-500">{t("types.loading")}</p>
        ) : null}
        {typeErrorMessage ? (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{typeErrorMessage}</p>
        ) : null}
        <div className="mt-4 grid gap-2">
          {managedTypes.map((type) => {
            const isActive = managedType?.id === type.id;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onTypeChange(type)}
                className={`flex min-h-11 items-center justify-between rounded-md border px-3 text-left text-sm font-black transition ${isActive ? "border-red-200 bg-red-700 text-white" : "border-black/10 bg-white text-neutral-700 hover:border-red-200 hover:bg-red-50"
                  }`}
              >
                <span>{type.name}</span>
                <span className={isActive ? "text-white/80" : "text-neutral-400"}>{type.slug}</span>
              </button>
            );
          })}
        </div>
        {!areTypesLoading && managedTypes.length === 0 ? (
          <p className="mt-3 rounded-md bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-500">{t("types.empty")}</p>
        ) : null}
      </aside>

      <form className="rounded-md border border-black/10 bg-white p-5 shadow-sm" onSubmit={(event) => event.preventDefault()}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
              <Film className="h-4 w-4" aria-hidden="true" />
              {activeTypeName}
            </p>
            <h2 className="mt-3 text-xl font-black text-neutral-950">{t("add.heading", { type: activeTypeName })}</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">{t("add.description")}</p>
          </div>
          <button
            type="button"
            disabled={form.isSubmitting}
            onClick={form.handleCreateItem}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-700 px-4 text-sm font-black text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {form.isSubmitting ? t("add.creating") : t("add.saveDraft")}
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 text-neutral-600">
          <AdminInput
            label={t("fields.title")}
            placeholder={t("placeholders.title")}
            value={form.title}
            onChange={form.handleTitleChange}
          />
          <AdminInput
            label={t("fields.slug")}
            placeholder={t("placeholders.slug")}
            value={form.slug}
            onChange={form.handleSlugChange}
          />
          <AdminInput
            label={t("fields.startDate")}
            type="date"
            value={form.startDate}
            onChange={(event) => form.setStartDate(event.target.value)}
          />
          <AdminInput
            error={form.priceError}
            label={t("fields.price")}
            min={0}
            type="number"
            step={1000}
            value={form.price}
            onChange={(event) => form.setPrice(event.target.value)}
          />
          <AdminSelect
            label={t("fields.status")}
            value={itemStatus?.id ?? ""}
            onChange={(event) => {
              const nextStatus = itemStatuses.find((status) => status.id === event.target.value);
              if (nextStatus) {
                onStatusChange(nextStatus);
              }
            }}
          >
            <option value="" disabled>
              {areStatusesLoading ? t("statuses.loading") : t("statuses.empty")}
            </option>
            {itemStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {t(`statuses.${status.slug}`)}
              </option>
            ))}
          </AdminSelect>
          {statusErrorMessage ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700 md:self-end">{statusErrorMessage}</p>
          ) : null}

          <div className="md:col-span-2">
            <RichTextEditor label={t("fields.description")} value={form.description} onChange={form.setDescription} />
          </div>

          <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
            <ImageUploadField
              fileName={form.imageFile?.name}
              isUploading={form.uploadingField === "image"}
              label={t("upload.image")}
              onFileChange={(event) => form.handleImageChange(event, "image")}
              onUrlChange={(event) => form.handleImageUrlChange(event, "image")}
              previewUrl={form.imagePreviewUrl}
              readyText={t("upload.ready")}
              remoteUrl={form.imageUrl}
              uploadText={t("upload.image")}
              uploadingText={t("upload.uploading")}
              urlPlaceholder={t("upload.urlPlaceholder")}
            />
            <ImageUploadField
              fileName={form.posterFile?.name}
              isUploading={form.uploadingField === "poster"}
              label={t("upload.poster")}
              onFileChange={(event) => form.handleImageChange(event, "poster")}
              onUrlChange={(event) => form.handleImageUrlChange(event, "poster")}
              previewUrl={form.posterPreviewUrl}
              readyText={t("upload.ready")}
              remoteUrl={form.posterUrl}
              uploadText={t("upload.poster")}
              uploadingText={t("upload.uploading")}
              urlPlaceholder={t("upload.urlPlaceholder")}
            />
          </div>

          <GenreSelector
            areGenresLoading={areGenresLoading}
            errorMessage={genresErrorMessage}
            genres={form.filteredGenres}
            onGenreToggle={form.handleGenreToggle}
            selectedGenreIds={form.selectedGenreIds}
          />

          <ItemMetadataForm
            areCitiesLoading={areCitiesLoading}
            cities={cities}
            citiesErrorMessage={citiesErrorMessage}
            eventMetadata={form.metadata.eventMetadata}
            genericMetadata={form.metadata.genericMetadata}
            hallTypes={hallTypes}
            hallTypesErrorMessage={hallTypesErrorMessage}
            areHallTypesLoading={areHallTypesLoading}
            itemTypeSlug={managedType?.slug}
            metadataJson={form.metadata.metadataJson}
            onEventMetadataChange={form.metadata.setEventMetadata}
            onGenericMetadataChange={form.metadata.setGenericMetadata}
            onCinemaMetadataChange={form.metadata.setCinemaMetadata}
            cinemaMetadata={form.metadata.cinemaMetadata}
          />

          <label className="md:col-span-2">
            <span className="text-sm font-bold text-neutral-800">{t("add.itemPayloadPreview")}</span>
            <pre className="mt-2 max-h-80 overflow-auto rounded-md border border-black/10 bg-neutral-950 p-4 text-xs font-semibold leading-6 text-white">
              {form.itemPayloadPreview}
            </pre>
          </label>
        </div>
      </form>
    </section>
  );
}
