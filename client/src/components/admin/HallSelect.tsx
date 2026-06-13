import type { HallOption } from "@/features/admin/types/venue.types";
import { AdminSelect } from "./shared/AdminSelect";
import { useTranslations } from "next-intl";

type HallSelectProps = {
  halls: HallOption[];
  label: string;
  onChange: (hallId: string) => void;
  value: string;
};

export function HallSelect({ halls, label, onChange, value }: HallSelectProps) {
  const t = useTranslations("Admin.showtimesForm");

  return (
    <AdminSelect label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="" disabled>
        {t("selectHall")}
      </option>
      {halls.map((hall) => (
        <option key={hall.id} value={hall.id}>
          {hall.name} ({hall.hallTypeName})
        </option>
      ))}
    </AdminSelect>
  );
}
