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
    namespace: "Auth.login",
  });

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  };
}

// Routes the localized login page to the shared auth feature.
export default function LoginPage({ params }: Props) {
  setRequestLocale(params.locale);

  return <AuthPage mode="login" />;
}
