import type { ShowtimeFormActions, ShowtimeManagerState } from "@/features/admin/types/showtime.types";
import { HallSelect } from "./HallSelect";
import { VenueSelect } from "./VenueSelect";
import { AdminInput } from "./shared/AdminInput";
import { AdminSelect } from "./shared/AdminSelect";
import { useTranslations } from "next-intl";

type ShowtimeFormProps = {
  actions: ShowtimeFormActions;
  state: ShowtimeManagerState;
};

export function ShowtimeForm({ actions, state }: ShowtimeFormProps) {
  const { filteredCities, filteredHalls, filteredVenues, form, isSaving, items, itemTypes, statuses } = state;
  const t = useTranslations("Admin.showtimesForm");
  const adminT = useTranslations("Admin");

  return (
    <form className="rounded-md border border-black/10 bg-white p-5 shadow-sm" onSubmit={(event) => event.preventDefault()}>
      <h3 className="text-lg font-black text-neutral-950">{form.editingShowtimeId ? t("editShowtime") : t("addShowtime")}</h3>
      <div className="mt-4 grid gap-4 text-neutral-600">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <AdminSelect label={adminT("fields.itemType")} value={form.selectedItemTypeId} onChange={(event) => actions.setSelectedItemTypeId(event.target.value)}>
            <option value="" disabled>
              {adminT("types.empty")}
            </option>
            {itemTypes.map((itemType) => (
              <option key={itemType.id} value={itemType.id}>
                {itemType.name}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect label={t("cityLabel")} value={form.selectedCityId} onChange={(event) => actions.setSelectedCityId(event.target.value)}>
            <option value="" disabled>
              {t("selectCity")}
            </option>
            {filteredCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </AdminSelect>
        </div>
        <AdminSelect label={t("itemLabel")} value={form.selectedItemId} onChange={(event) => actions.setSelectedItemId(event.target.value)}>
          <option value="" disabled>
            {t("selectItem")}
          </option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </AdminSelect>
        <div className="grid gap-4 sm:grid-cols-2">
          <VenueSelect label={t("venueLabel")} value={form.selectedVenueId} venues={filteredVenues} onChange={actions.setSelectedVenueId} />
          <HallSelect label={t("hallLabel")} value={form.selectedHallId} halls={filteredHalls} onChange={actions.setSelectedHallId} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label={t("startDateTimeLabel")} type="datetime-local" value={form.startTime} onChange={(event) => actions.setStartTime(event.target.value)} />
          <AdminInput label={t("endDateTimeLabel")} type="datetime-local" value={form.endTime} onChange={(event) => actions.setEndTime(event.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <AdminInput label={t("priceLabel")} type="number" min={0} step={1000} value={form.price} onChange={(event) => actions.setPrice(event.target.value)} />
          <AdminSelect label={t("statusLabel")} value={form.selectedStatusId} onChange={(event) => actions.setSelectedStatusId(event.target.value)}>
            <option value="" disabled>
              Select status
            </option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </AdminSelect>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {form.editingShowtimeId ? (
          <button type="button" onClick={actions.cancelEdit} className="inline-flex min-h-11 items-center rounded-md bg-neutral-100 px-4 text-sm font-black text-neutral-700">
            Cancel
          </button>
        ) : null}
        <button
          type="button"
          disabled={isSaving}
          onClick={actions.saveShowtime}
          className="inline-flex min-h-11 items-center rounded-md bg-red-700 px-4 text-sm font-black text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isSaving ? "Saving..." : form.editingShowtimeId ? "Save changes" : "Add Showtime"}
        </button>
      </div>
    </form>
  );
}
