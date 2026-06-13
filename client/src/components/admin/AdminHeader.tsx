import { Ticket } from "lucide-react";
import { useTranslations } from "next-intl";

export function AdminHeader() {
  const t = useTranslations("Admin");

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1 text-sm font-bold text-red-700">
          <Ticket className="h-4 w-4" aria-hidden="true" />
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 text-3xl font-black text-neutral-950 sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{t("subtitle")}</p>
      </div>
    </div>
  );
}
