"use client"

import { usePathname, useRouter } from "next/navigation"
import { LOCALES, LOCALE_META, LOCALE_STORAGE_KEY, isLocale } from "@/i18n"
import { useLocale, useT } from "@/i18n/LocaleProvider"

/**
 * Phase i18n-2 — the single language selector. It drives both the interface
 * language and (from Phase 4 on) the study/base language, persists the choice,
 * and navigates to the same page under the chosen locale prefix.
 */
export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useT()

  function change(next: string) {
    if (!isLocale(next) || next === locale) return
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      /* storage unavailable — choice still applies for this session */
    }
    const segments = pathname.split("/")
    if (isLocale(segments[1])) segments[1] = next
    else segments.splice(1, 0, next)
    router.push(segments.join("/") || `/${next}`)
  }

  return (
    <select
      aria-label={t("nav.language")}
      value={locale}
      onChange={(e) => change(e.target.value)}
      className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs font-medium text-ink-soft outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      {LOCALES.map((code) => (
        <option key={code} value={code}>
          {LOCALE_META[code].label}
        </option>
      ))}
    </select>
  )
}
