"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/auth/AuthProvider"
import { SyncManager } from "@/sync/SyncManager"
import { LocaleProvider } from "@/i18n/LocaleProvider"
import { DEFAULT_LOCALE, type Locale } from "@/i18n"

export function Providers({
  locale = DEFAULT_LOCALE,
  children,
}: {
  locale?: Locale
  children: ReactNode
}) {
  return (
    <LocaleProvider locale={locale}>
      <AuthProvider>
        <SyncManager />
        {children}
      </AuthProvider>
    </LocaleProvider>
  )
}
