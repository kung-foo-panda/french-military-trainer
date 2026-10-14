"use client"

import { useState, type FormEvent } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { useSync } from "@/sync/useSync"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

const SYNC_LABEL: Record<string, string> = {
  offline: "Local only",
  idle: "Not syncing",
  syncing: "Syncing…",
  synced: "Synced",
  error: "Sync error",
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
          <h2 className="font-medium">Account</h2>
          <Badge tone="warn">Not configured</Badge>
        </div>
        <p className="text-sm text-ink-soft">
          Firebase env vars are missing, so the app runs local-only and progress
          stays on this device. Copy <code>.env.example</code> to{" "}
          <code>.env.local</code>, add your project values, then enable Email/
          Password and Google sign-in plus Firestore in the Firebase console.
        </p>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-ink-soft">Checking session…</p>
      </Card>
    )
  }

  if (user) {
    return (
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium">Account</h2>
          <Badge tone={status === "error" ? "danger" : "success"}>
            {SYNC_LABEL[status]}
          </Badge>
        </div>
        <p className="text-sm text-ink">
          Signed in as{" "}
          <span className="font-medium">
            {user.displayName ?? user.email ?? user.uid}
          </span>
          {user.email && user.displayName ? ` (${user.email})` : ""}
        </p>
        <p className="text-xs text-ink-faint">
          {lastSyncedAt
            ? `Last synced ${new Date(lastSyncedAt).toLocaleTimeString()}`
            : "Not synced yet"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={syncNow}>
            Sync now
          </Button>
          <Button variant="ghost" size="sm" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-medium">{register ? "Create account" : "Sign in"}</h2>
        <button
          type="button"
          onClick={() => setRegister((v) => !v)}
          className="text-xs font-medium text-accent-strong hover:underline"
        >
          {register ? "Have an account? Sign in" : "New here? Create account"}
        </button>
      </div>

      <form className="space-y-3" onSubmit={submit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <Button type="submit" disabled={busy}>
          {busy ? "Working…" : register ? "Create account" : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="secondary"
        onClick={() => void signInGoogle()}
        disabled={busy}
      >
        Continue with Google
      </Button>

      {error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </Card>
  )
}
