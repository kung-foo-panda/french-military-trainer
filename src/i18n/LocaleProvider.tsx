"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { DEFAULT_LOCALE, type Locale } from "./config"
import { getMessages } from "./messages"
import { createT, type Translate } from "./translate"

type LocaleContextValue = {
  locale: Locale
  t: Translate
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  t: createT(getMessages(DEFAULT_LOCALE)),
})

export function LocaleProvider({
  locale = DEFAULT_LOCALE,
  children,
}: {
  locale?: Locale
  children: ReactNode
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: createT(getMessages(locale)) }),
    [locale]
  )
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale
}

export function useT(): Translate {
  return useContext(LocaleContext).t
}
