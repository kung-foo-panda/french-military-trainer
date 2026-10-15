import { DEFAULT_LOCALE, type Locale } from "./config"
import { getMessages } from "./messages"
import { createT } from "./translate"

/**
 * Phase i18n-1 — server-component counterpart of `useT()`. Defaults to the
 * app default locale until routing threads a locale through (Phase 2).
 */
export function getServerT(locale: Locale = DEFAULT_LOCALE) {
  return createT(getMessages(locale))
}
