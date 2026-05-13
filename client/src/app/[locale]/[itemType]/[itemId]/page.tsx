import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { getItemDetail, getItemDetailPaths, ItemDetailPage } from "@/features/item-detail";
import { routing, type Locale } from "@/i18n/routing";

type Props = {
  params: {
    itemId: string;
    itemType: string;
    locale: Locale;
  };
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getItemDetailPaths().map((path) => ({
      locale,
      ...path,
    })),
  );
}

export function generateMetadata({ params }: Props): Metadata {
  const item = getItemDetail(params.itemType, params.itemId, params.locale);

  if (!item) {
    return {};
  }

  return {
    title: `${item.title} | TicketPro`,
    description: item.subtitle,
  };
}

// Routes every supported item type to the shared detail feature.
export default function ItemDetailRoute({ params }: Props) {
  setRequestLocale(params.locale);

  const item = getItemDetail(params.itemType, params.itemId, params.locale);

  if (!item) {
    notFound();
  }

  return <ItemDetailPage item={item} />;
}
