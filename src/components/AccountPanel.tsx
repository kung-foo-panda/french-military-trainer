"use client"

import { useState, type FormEvent } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { useSync } from "@/sync/useSync"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { useLocale, useT } from "@/i18n/LocaleProvider"
import { LOCALE_META, type MessageKey } from "@/i18n"

const SYNC_LABEL_KEY: Record<string, MessageKey> = {
  offline: "account.sync.offline",
  idle: "account.sync.idle",
  syncing: "account.sync.syncing",
  synced: "account.sync.synced",
  error: "account.sync.error",
}

export function AccountPanel() {
  const {
    user,
    loading,
    configured,
    error,
    signInEmail,
    registerEmail,
    signInGoogle,
    signOut,
  } = useAuth()
  const { status, lastSyncedAt, syncNow } = useSync()
  const locale = useLocale()
  const t = useT()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [register, setRegister] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      if (register) await registerEmail(email, password)
      else await signInEmail(email, password)
    } catch {
      /* surfaced via `error` */
    } finally {
      setBusy(false)
    }
  }

  if (!configured) {
    return (
      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">{t("account.title")}</h2>
          <Badge tone="warn">{t("account.notConfigured")}</Badge>
        </div>
        <p className="text-sm text-ink-soft">{t("account.notConfiguredBody")}</p>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-ink-soft">{t("account.checkingSession")}</p>
      </Card>
    )
  }

  if (user) {
    return (
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium">{t("account.title")}</h2>
          <Badge tone={status === "error" ? "danger" : "success"}>
            {t(SYNC_LABEL_KEY[status])}
          </Badge>
        </div>
        <p className="text-sm text-ink">
          {t("account.signedInAsPrefix")}{" "}
          <span className="font-medium">
            {user.displayName ?? user.email ?? user.uid}
          </span>
          {user.email && user.displayName
            ? t("account.emailSuffix", { email: user.email })
            : ""}
        </p>
        <p className="text-xs text-ink-faint">
          {lastSyncedAt
            ? t("account.lastSyncedAt", {
                time: new Date(lastSyncedAt).toLocaleTimeString(
                  LOCALE_META[locale].htmlLang
                ),
              })
            : t("account.notSyncedYet")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={syncNow}>
            {t("account.syncNow")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => void signOut()}>
            {t("account.signOut")}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-medium">
          {register ? t("account.createAccount") : t("account.signIn")}
        </h2>
        <button
          type="button"
          onClick={() => setRegister((v) => !v)}
          className="text-xs font-medium text-accent-strong hover:underline"
        >
          {register ? t("account.haveAccount") : t("account.newHere")}
        </button>
      </div>

      <form className="space-y-3" onSubmit={submit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("account.emailPlaceholder")}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("account.passwordPlaceholder")}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <Button type="submit" disabled={busy}>
          {busy
            ? t("account.working")
            : register
              ? t("account.createAccount")
              : t("account.signIn")}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-border" />
        {t("account.or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="secondary"
        onClick={() => void signInGoogle()}
        disabled={busy}
      >
        {t("account.continueWithGoogle")}
      </Button>

      {error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </Card>
  )
}
