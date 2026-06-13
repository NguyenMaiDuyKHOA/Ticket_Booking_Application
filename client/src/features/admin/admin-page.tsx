"use client";

import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Navbar } from "@/components/navbar";
import { Link } from "@/i18n/navigation";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ItemForm } from "@/components/admin/ItemForm";
import { ItemList } from "@/components/admin/ItemList";
import { OrdersPanel } from "@/components/admin/OrdersPanel";
import { ShowtimeManager } from "@/components/admin/ShowtimeManager";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useItemLookups } from "@/hooks/useItemLookups";
import type { AdminTab } from "./types/item.types";

export function AdminPage() {
  const t = useTranslations("Admin");
  const [activeTab, setActiveTab] = useState<AdminTab>("add");
  const { isAdmin, isReady } = useAdminAccess();
  const itemLookups = useItemLookups(isAdmin);

  if (!isReady) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-neutral-50 px-4">
          <p className="text-sm font-semibold text-neutral-500">{t("loading")}</p>
        </main>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-neutral-50 px-4">
          <section className="w-full max-w-md rounded-md border border-black/10 bg-white p-6 text-center shadow-sm">
            <ShieldAlert className="mx-auto h-10 w-10 text-red-700" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-black text-neutral-950">{t("forbidden.title")}</h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{t("forbidden.description")}</p>
            <Link
              href="/"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-red-700 px-4 text-sm font-black text-white transition hover:bg-red-800"
            >
              {t("forbidden.backHome")}
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <AdminHeader />
          <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {activeTab === "add" ? (
              <ItemForm
                areCitiesLoading={itemLookups.areCitiesLoading}
                areGenresLoading={itemLookups.areGenresLoading}
                areHallTypesLoading={itemLookups.areHallTypesLoading}
                areStatusesLoading={itemLookups.areItemStatusesLoading}
                areTypesLoading={itemLookups.areItemTypesLoading}
                cities={itemLookups.cities}
                citiesErrorMessage={itemLookups.citiesError}
                genres={itemLookups.genres}
                genresErrorMessage={itemLookups.genresError}
                hallTypes={itemLookups.hallTypes}
                hallTypesErrorMessage={itemLookups.hallTypesError}
                itemStatus={itemLookups.itemStatus}
                itemStatuses={itemLookups.itemStatuses}
                managedType={itemLookups.managedType}
                managedTypes={itemLookups.managedTypes}
                onStatusChange={itemLookups.setItemStatus}
                onTypeChange={itemLookups.setManagedType}
                statusErrorMessage={itemLookups.itemStatusesError}
                typeErrorMessage={itemLookups.itemTypesError}
              />
            ) : null}
            {activeTab === "list" ? <ItemList /> : null}
            {activeTab === "showtimes" ? <ShowtimeManager /> : null}
            {activeTab === "orders" ? <OrdersPanel /> : null}
          </div>
        </section>
      </main>
    </>
  );
}
