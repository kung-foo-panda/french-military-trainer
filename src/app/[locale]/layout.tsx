import type { Metadata } from "next"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import "../globals.css"
import { AppNav } from "@/components/AppNav"
import { AuthMenu } from "@/components/AuthMenu"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Providers } from "@/components/Providers"
import { LOCALES, LOCALE_META, isLocale, localePath } from "@/i18n"
import { getServerT } from "@/i18n/server"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
})

/** Phase i18n-2 — only the pre-rendered locales exist. */
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

type LocaleParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getServerT(locale)
  return { title: t("app.title"), description: t("app.description") }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getServerT(locale)

  return (
    <html lang={LOCALE_META[locale].htmlLang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Providers locale={locale}>
            <header className="sticky top-0 z-10 border-b border-border bg-surface/85 backdrop-blur">
              <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
                <Link
                  href={localePath(locale, "/")}
                  className="text-sm font-semibold tracking-tight text-ink"
                >
                  {t("app.brand")}
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                  <AppNav />
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <AuthMenu />
                  </div>
                </div>
              </div>
            </header>
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
              {children}
            </main>
            <footer className="mx-auto w-full max-w-5xl px-4 py-6 text-xs text-ink-faint">
              {t("app.footer")}
            </footer>
          </Providers>
        </div>
      </body>
    </html>
  )
}
