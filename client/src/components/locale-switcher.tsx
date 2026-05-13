"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeFlags = {
  vi: {
    src: "/vietnam_circle.png",
    altKey: "vi",
  },
  en: {
    src: "/uk_circle.png",
    altKey: "en",
  },
} as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const currentLocale = locale as keyof typeof localeFlags;
  const currentFlag = localeFlags[currentLocale] ?? localeFlags.vi;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={switcherRef} className="relative">
      <button
        type="button"
        aria-label={t("label")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-8 items-center gap-2 rounded-md border border-black/10 bg-white px-2.5 shadow-sm transition hover:bg-neutral-50"
      >
        <Image
          src={currentFlag.src}
          alt={t(currentFlag.altKey)}
          width={24}
          height={24}
          className="h-5 w-5 rounded-full object-cover"
          priority
        />
        <ChevronDown
          className={`h-4 w-4 text-neutral-500 transition ${isOpen ? "rotate-180" : ""
            }`}
          aria-hidden="true"
        />
        <span className="sr-only">{t("label")}</span>
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute right-0 top-12 z-40 grid min-w-14 gap-1 rounded-md border border-black/10 bg-white p-1 shadow-lg"
        >
          {routing.locales.map((targetLocale) => {
            const flag = localeFlags[targetLocale];
            const isActive = targetLocale === locale;

            return (
              <Link
                key={targetLocale}
                href={pathname || "/"}
                locale={targetLocale}
                role="option"
                aria-selected={isActive}
                onClick={() => setIsOpen(false)}
                className={`grid h-10 w-12 place-items-center rounded-md transition ${isActive ? "bg-neutral-100" : "hover:bg-neutral-100"
                  }`}
              >
                <Image
                  src={flag.src}
                  alt={t(flag.altKey)}
                  width={26}
                  height={26}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="sr-only">{t(flag.altKey)}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
