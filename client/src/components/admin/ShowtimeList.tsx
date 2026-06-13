import type { ShowtimeResponse } from "@/lib/showtimes-api";

import { formatDate, formatMoney, formatTime } from "@/features/admin/utils/format";
import { useTranslations } from "next-intl";

type ShowtimeListProps = {
  isLoading: boolean;
  onDelete: (showtimeId: string) => void;
  onEdit: (showtime: ShowtimeResponse) => void;
  showtimes: ShowtimeResponse[];
};

export function ShowtimeList({ isLoading, onDelete, onEdit, showtimes }: ShowtimeListProps) {
  const t = useTranslations("Admin.showtimesForm");

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {[
              t("itemLabel"),
              t("dateLabel"),
              t("startDateTimeLabel"),
              t("endDateTimeLabel"),
              t("venueLabel"),
              t("hallLabel"),
              t("priceLabel"),
              t("statusLabel"),
              t("actionsLabel")
            ].map((header) => (
              <th key={header} className="border-b border-black/10 px-3 py-3 font-black text-neutral-500">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {showtimes.map((showtime) => (
            <tr key={showtime.id} className="hover:bg-neutral-50">
              <td className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">{showtime.itemTitle}</td>
              <td className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">{formatDate(showtime.startTime)}</td>
              <td className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">{formatTime(showtime.startTime)}</td>
              <td className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">{formatTime(showtime.endTime)}</td>
              <td className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">{showtime.venueName}</td>
              <td className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">{showtime.hallName}</td>
              <td className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">{formatMoney(showtime.price)}</td>
              <td className="border-b border-black/5 px-3 py-3 font-semibold text-neutral-700">{showtime.showtimeStatusName}</td>
              <td className="border-b border-black/5 px-3 py-3">
                <div className="flex gap-2">
                  <button type="button" onClick={() => onEdit(showtime)} className="rounded-md bg-neutral-950 px-3 py-2 text-xs font-black text-white">
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(showtime.id)} className="rounded-md bg-red-700 px-3 py-2 text-xs font-black text-white">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isLoading && showtimes.length === 0 ? (
        <p className="mt-4 rounded-md bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-500">{t("emptyShowtimes")}</p>
      ) : null}
    </div>
  );
}
