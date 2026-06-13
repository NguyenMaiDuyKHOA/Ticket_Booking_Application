import { useTranslations } from "next-intl";

import { adminTabs } from "@/features/admin/constants";
import type { AdminTab } from "@/features/admin/types/item.types";

type AdminTabsProps = {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
};

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const t = useTranslations("Admin");

  return (
    <div className="mt-6 flex flex-wrap gap-2 rounded-md border border-black/10 bg-white p-2 shadow-sm">
      {adminTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-black transition ${isActive ? "bg-neutral-950 text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {t(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
