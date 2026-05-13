import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BookingExperience } from "@/features/cgv";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "Metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CgvBookingPage({ params }: Props) {
  setRequestLocale(params.locale);

  return <BookingExperience />;
}
