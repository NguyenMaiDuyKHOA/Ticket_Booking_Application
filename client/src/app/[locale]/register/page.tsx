import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthPage } from "@/features/auth";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "Auth.register",
  });

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  };
}

// Routes the localized registration page to the shared auth feature.
export default function RegisterPage({ params }: Props) {
  setRequestLocale(params.locale);

  return <AuthPage mode="register" />;
}
