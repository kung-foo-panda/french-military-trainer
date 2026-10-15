"use client"

import Link from "next/link"
import { useAuth } from "@/auth/AuthProvider"
import { useSync } from "@/sync/useSync"
import { Badge } from "@/components/ui/Badge"
import { buttonClass } from "@/components/ui/Button"
import { useLocale, useT } from "@/i18n/LocaleProvider"
import { localePath, type MessageKey } from "@/i18n"

const SYNC_TONE = {
  synced: "success",
  syncing: "accent",
  error: "danger",
  idle: "neutral",
  offline: "neutral",
} as const

const SYNC_STATUS_KEY: Record<string, MessageKey> = {
  synced: "sync.status.synced",
  syncing: "sync.status.syncing",
  error: "sync.status.error",
  idle: "sync.status.idle",
  offline: "sync.status.offline",
}

export function AuthMenu() {
  const { user, loading, configured, signOut } = useAuth()
  const { status } = useSync()
  const locale = useLocale()
  const t = useT()

  if (!configured) {
    return <Badge tone="neutral">{t("auth.localOnly")}</Badge>
  }

  if (loading) {
    return <span className="text-xs text-ink-faint">…</span>
  }

  if (!user) {
    return (
      <Link
        href={localePath(locale, "/settings")}
        className={buttonClass("secondary", "sm")}
      >
        {t("auth.signIn")}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge tone={SYNC_TONE[status]}>{t(SYNC_STATUS_KEY[status])}</Badge>
      <span className="hidden text-xs text-ink-soft sm:inline">
        {user.displayName ?? user.email ?? t("auth.signedIn")}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className={buttonClass("ghost", "sm")}
      >
        {t("auth.signOut")}
      </button>
    </div>
  )
}
