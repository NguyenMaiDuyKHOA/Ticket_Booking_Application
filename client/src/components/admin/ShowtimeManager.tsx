import { useShowtimes } from "@/hooks/useShowtimes";
import { ShowtimeForm } from "./ShowtimeForm";
import { ShowtimeList } from "./ShowtimeList";
import { AdminSelect } from "./shared/AdminSelect";
import { useTranslations } from "next-intl";

export function ShowtimeManager() {
  const { actions, state } = useShowtimes();
  const t = useTranslations("Admin.showtimesForm");
  const adminT = useTranslations("Admin");

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-neutral-950">{t("heading")}</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              {t("description")}
            </p>
          </div>
          <div className="grid min-w-72 gap-3 text-neutral-600 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <AdminSelect label={adminT("fields.itemType")} value={state.form.selectedItemTypeId} onChange={(event) => actions.setSelectedItemTypeId(event.target.value)}>
              <option value="" disabled>
                {adminT("types.empty")}
              </option>
              {state.itemTypes.map((itemType) => (
                <option key={itemType.id} value={itemType.id}>
                  {itemType.name}
                </option>
              ))}
            </AdminSelect>
            <AdminSelect label={t("itemFilterLabel")} value={state.form.selectedListItemId} onChange={(event) => actions.setSelectedListItemId(event.target.value)}>
              <option value="">{t("allItems")}</option>
              {state.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </AdminSelect>
          </div>
        </div>

        {state.isLoading ? <p className="mt-4 rounded-md bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-500">Loading showtime data...</p> : null}
        {state.errorMessage ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{state.errorMessage}</p> : null}

        <ShowtimeList
          isLoading={state.isLoading}
          onDelete={(showtimeId) => void actions.deleteShowtime(showtimeId)}
          onEdit={actions.editShowtime}
          showtimes={state.filteredShowtimes}
        />
      </div>

      <ShowtimeForm actions={actions} state={state} />
    </section>
  );
}
