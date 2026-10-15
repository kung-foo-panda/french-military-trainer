import type { Locale } from "../config"
import { en, type MessageKey, type Messages } from "./en"
import { pl } from "./pl"
import { de } from "./de"

/**
 * Phase i18n-1 — locale → catalogue. Every supported locale ships its own
 * `Messages`-typed object; `getMessages` only falls back to English for a
 * locale that is in routing but has no catalogue yet (none today).
 */
const CATALOGUES: Partial<Record<Locale, Messages>> = { en, pl, de }

export function getMessages(locale: Locale): Messages {
  return CATALOGUES[locale] ?? en
}

export { en, pl, de }
export type { MessageKey, Messages }
