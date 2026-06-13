import type {Metadata} from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {ToastProvider} from "@/components/toast";
import {routing} from "@/i18n/routing";
import "../globals.css";

// const geistSans = localFont({
//   src: "../fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

// const geistMono = localFont({
//   src: "../fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  applicationName: "TicketPro",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type Props = Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>;

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`bg-background text-foreground antialiased`}
      >
        {/* ${geistSans.variable} ${geistMono.variable} */}
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
