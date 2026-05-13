"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Film,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { Navbar } from "@/components/navbar";
import { Link } from "@/i18n/navigation";

export type AuthMode = "login" | "register";

type AuthPageProps = {
  mode: AuthMode;
};

type AuthFieldProps = {
  autoComplete: string;
  icon: typeof Mail;
  inputMode?: "email" | "tel" | "text";
  label: string;
  name: string;
  placeholder: string;
  type: string;
};

const customerBenefits = ["seatHold", "fastCheckout", "ticketHistory"] as const;

// Renders the localized authentication page shell for login and registration flows.
export function AuthPage({ mode }: AuthPageProps) {
  const t = useTranslations("Auth");
  const isRegister = mode === "register";

  return (
    <>
      <Navbar variant="home" />
      <main className="min-h-[calc(100vh-65px)] bg-[#f7f7f5]">
        <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8">
          {/* Brand panel anchors the auth flow in the cinema booking experience. */}
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1 text-sm font-bold text-red-700 shadow-sm">
                <Ticket className="h-4 w-4" aria-hidden="true" />
                {t("hero.eyebrow")}
              </div>

              <h1 className="mt-5 text-5xl font-black leading-tight text-neutral-950">
                {t(`${mode}.title`)}
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-neutral-600">
                {t(`${mode}.subtitle`)}
              </p>

              <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-neutral-950 shadow-xl">
                <div className="relative h-64">
                  <Image
                    src="/Poster/Thor_poster_cgv.jpg"
                    alt=""
                    fill
                    priority
                    className="object-cover opacity-70"
                    sizes="(min-width: 1024px) 560px, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-md bg-red-700 text-white">
                        <Film className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-red-100">
                          {t("hero.cardLabel")}
                        </p>
                        <p className="text-xl font-black text-white">
                          {t("hero.cardTitle")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-5">
                  {customerBenefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3 rounded-md bg-white/10 p-3 text-sm font-semibold text-neutral-100"
                    >
                      <BadgeCheck className="h-5 w-5 text-amber-300" aria-hidden="true" />
                      {t(`benefits.${benefit}`)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Auth card keeps the primary account action prominent on all viewports. */}
          <section className="w-full">
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-xl sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-red-700">
                    {t("brand")}
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-neutral-950">
                    {t(`${mode}.heading`)}
                  </h2>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-red-700 text-white">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 rounded-md bg-neutral-100 p-1 text-sm font-black">
                <Link
                  href="/login"
                  className={`rounded-md px-3 py-2 text-center transition ${!isRegister
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-950"
                    }`}
                >
                  {t("tabs.login")}
                </Link>
                <Link
                  href="/register"
                  className={`rounded-md px-3 py-2 text-center transition ${isRegister
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-950"
                    }`}
                >
                  {t("tabs.register")}
                </Link>
              </div>

              <AuthForm mode={mode} />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

// Renders validated auth inputs while deferring API submission until backend endpoints are connected.
function AuthForm({ mode }: AuthPageProps) {
  const t = useTranslations("Auth");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === "register";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isRegister && password !== confirmPassword) {
      setPasswordMatchError(t("errors.passwordMismatch"));
      return;
    }

    setPasswordMatchError("");
  }

  return (
    <form className="mt-6 grid gap-4" noValidate={false} onSubmit={handleSubmit}>
      {isRegister ? (
        <AuthField
          autoComplete="name"
          icon={User}
          label={t("fields.fullName")}
          name="fullName"
          placeholder={t("placeholders.fullName")}
          type="text"
        />
      ) : null}

      {/* <AuthField
        autoComplete="email"
        icon={Mail}
        inputMode="email"
        label={t("fields.email")}
        name="email"
        placeholder={t("placeholders.email")}
        type="email"
      /> */}

      {/* {isRegister ? ( */}
      <AuthField
        autoComplete="tel"
        icon={Phone}
        inputMode="tel"
        label={t("fields.phone")}
        name="phone"
        placeholder={t("placeholders.phone")}
        type="tel"
      />
      {/* ) : null} */}

      <div>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="password"
            className="text-sm font-bold text-neutral-800"
          >
            {t("fields.password")}
          </label>
          {!isRegister ? (
            <Link
              href="/login"
              className="text-sm font-bold text-red-700 hover:text-red-800"
            >
              {t("login.forgotPassword")}
            </Link>
          ) : null}
        </div>
        <div className="mt-2 flex items-center rounded-md border border-black/10 bg-white px-3 shadow-sm focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
          <LockKeyhole className="h-5 w-5 text-neutral-400" aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
            minLength={8}
            placeholder={t("placeholders.password")}
            value={password}
            onChange={(event) => {
              const nextPassword = event.target.value;

              setPassword(nextPassword);
              if (passwordMatchError && nextPassword === confirmPassword) {
                setPasswordMatchError("");
              }
            }}
            className="min-h-12 w-full bg-transparent px-3 text-sm font-semibold text-neutral-950 outline-none placeholder:text-neutral-400"
          />
          <button
            type="button"
            aria-label={showPassword ? t("aria.hidePassword") : t("aria.showPassword")}
            onClick={() => setShowPassword((current) => !current)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isRegister ? (
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm font-bold text-neutral-800"
          >
            {t("fields.confirmPassword")}
          </label>
          <div className="mt-2 flex items-center rounded-md border border-black/10 bg-white px-3 shadow-sm focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
            <LockKeyhole className="h-5 w-5 text-neutral-400" aria-hidden="true" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              aria-invalid={Boolean(passwordMatchError)}
              aria-describedby={passwordMatchError ? "confirm-password-error" : undefined}
              placeholder={t("placeholders.confirmPassword")}
              value={confirmPassword}
              onChange={(event) => {
                const nextConfirmPassword = event.target.value;

                setConfirmPassword(nextConfirmPassword);
                if (passwordMatchError && password === nextConfirmPassword) {
                  setPasswordMatchError("");
                }
              }}
              className="min-h-12 w-full bg-transparent px-3 text-sm font-semibold text-neutral-950 outline-none placeholder:text-neutral-400"
            />
          </div>
          {passwordMatchError ? (
            <p id="confirm-password-error" className="mt-2 text-sm font-semibold text-red-700">
              {passwordMatchError}
            </p>
          ) : null}
        </div>
      ) : null}

      {isRegister ? (
        <label className="flex items-start gap-3 text-sm leading-6 text-neutral-600">
          <input
            type="checkbox"
            required
            onInvalid={(e) => {
              e.currentTarget.setCustomValidity(
                t("register.alertAceptedTerms")
              )
            }}
            onChange={(e) => {
              e.currentTarget.setCustomValidity('')
            }}
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-red-700 focus:ring-red-600"
          />
          <span>{t("register.terms")}</span>
        </label>
      ) : null}

      <button
        type="submit"
        className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-red-700 px-4 text-sm font-black text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
      >
        {t(`${mode}.submit`)}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>

      <p className="text-center text-sm font-semibold text-neutral-600">
        {t(`${mode}.switchPrompt`)}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-black text-red-700 hover:text-red-800"
        >
          {t(`${mode}.switchAction`)}
        </Link>
      </p>
    </form>
  );
}

// Renders one labeled auth input with a leading icon and native validation support.
function AuthField({
  autoComplete,
  icon: Icon,
  inputMode,
  label,
  name,
  placeholder,
  type,
}: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-bold text-neutral-800">
        {label}
      </label>
      <div className="mt-2 flex items-center rounded-md border border-black/10 bg-white px-3 shadow-sm focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
        <Icon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
        <input
          id={name}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required
          placeholder={placeholder}
          className="min-h-12 w-full bg-transparent px-3 text-sm font-semibold text-neutral-950 outline-none placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}
