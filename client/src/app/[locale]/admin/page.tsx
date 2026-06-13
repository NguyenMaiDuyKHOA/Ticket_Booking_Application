import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AdminPage } from "@/features/admin";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: {
    locale: Locale;
  };
};

export const metadata: Metadata = {
  title: "Admin | TicketPro",
};

export default function AdminRoute({ params }: Props) {
  setRequestLocale(params.locale);

  return <AdminPage />;
}
