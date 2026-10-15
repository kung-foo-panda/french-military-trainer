/**
 * Phase i18n-1 — supported locales and their display metadata.
 *
 * Adding a language is a three-step, type-checked extension: append the code
 * here, add `src/i18n/messages/<code>.ts` (typed as `Messages`), and add a
 * content overlay under `src/content/locales/`. Routing, the picker, and the
 * completeness tests all derive from `LOCALES`.
 */
export const LOCALES = ["en", "pl", "de"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

export type LocaleMeta = {
  /** Native display name, shown in the language picker. */
  label: string
  /** BCP-47 tag for `<html lang>` and Intl formatting. */
  htmlLang: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { label: "English", htmlLang: "en" },
  pl: { label: "Polski", htmlLang: "pl" },
  de: { label: "Deutsch", htmlLang: "de" },
}

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (LOCALES as readonly string[]).includes(value)
  )
}

/** localStorage key remembering the visitor's language choice. */
export const LOCALE_STORAGE_KEY = "fmt.locale"

/**
 * Prefix an app-relative path with its locale (`/train` → `/en/train`). The
 * public entry page reads the same locale to redirect `/` and legacy routes.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`
}
