"use client";

import Image from "next/image";
import { Check, ChevronDown, Languages, LayoutDashboard, LogIn, LogOut, Ticket, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { clearAuthSession, getAuthSession } from "@/lib/auth-api";
import { useToast } from "./toast";

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

const accountLinks = [
  { href: "/profile", labelKey: "profile", icon: User },
  { href: "/tickets", labelKey: "ticketHistory", icon: Ticket },
] as const;

function isAdminRole(role: unknown) {
  return role === "Admin" || role === 2;
}

export function UserMenu() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("AccountMenu");
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasHandledExpiredSession = useRef(false);

  useEffect(() => {
    const session = getAuthSession();

    setIsAuthenticated(session.status === "authenticated");
    setIsAdmin(session.status === "authenticated" && isAdminRole(session.user.role));

    if (session.status === "expired" && !hasHandledExpiredSession.current) {
      hasHandledExpiredSession.current = true;
      showToast({ message: t("sessionExpired"), type: "error" });
      router.push("/login");
    }
  }, [router, showToast, t]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
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

  function handleLogout() {
    clearAuthSession();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsOpen(false);
    showToast({
      message: t("logoutSuccess"),
      type: "success",
    });
    router.push("/login");
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={t("label")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-black/10 bg-white px-2.5 shadow-sm transition hover:bg-neutral-50"
      >
        <Image
          src="/pesonal.png"
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
          aria-hidden="true"
        />
        <ChevronDown
          className={`h-4 w-4 text-neutral-500 transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-12 z-40 w-64 rounded-md border border-black/10 bg-white p-2 text-sm shadow-lg"
        >
          <div className="grid gap-1">
            {isAuthenticated ? (
              <>
                {accountLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      <Icon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                      {t(item.labelKey)}
                    </Link>
                  );
                })}
                {isAdmin ? (
                  <Link
                    href="/admin"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    <LayoutDashboard className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                    {t("admin")}
                  </Link>
                ) : null}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left font-medium text-red-700 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
              >
                <LogIn className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                {t("login")}
              </Link>
            )}
          </div>

          <div className="my-2 h-px bg-black/10" />

          <div className="px-3 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              {t("language")}
            </span>
          </div>

          <div className="grid gap-1">
            {routing.locales.map((targetLocale) => {
              const flag = localeFlags[targetLocale];
              const isActive = targetLocale === locale;

              return (
                <Link
                  key={targetLocale}
                  href={pathname || "/"}
                  locale={targetLocale}
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                >
                  <span className="inline-flex items-center gap-3">
                    <Image
                      src={flag.src}
                      alt={t(flag.altKey)}
                      width={24}
                      height={24}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    {t(flag.altKey)}
                  </span>
                  {isActive ? <Check className="h-4 w-4 text-red-700" aria-hidden="true" /> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
