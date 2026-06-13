import type { VenueOption } from "@/features/admin/types/venue.types";
import { AdminSelect } from "./shared/AdminSelect";
import { useTranslations } from "next-intl";

type VenueSelectProps = {
  label: string;
  onChange: (venueId: string) => void;
  value: string;
  venues: VenueOption[];
};

export function VenueSelect({ label, onChange, value, venues }: VenueSelectProps) {
  const t = useTranslations("Admin.showtimesForm");

  return (
    <AdminSelect label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="" disabled>
        {t("selectVenue")}
      </option>
      {venues.map((venue) => (
        <option key={venue.id} value={venue.id}>
          {venue.name}
        </option>
      ))}
    </AdminSelect>
  );
}
