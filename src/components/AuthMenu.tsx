"use client"

import Link from "next/link"
import { useAuth } from "@/auth/AuthProvider"
import { useSync } from "@/sync/useSync"
import { Badge } from "@/components/ui/Badge"
import { buttonClass } from "@/components/ui/Button"

const SYNC_TONE = {
  synced: "success",
  syncing: "accent",
  error: "danger",
  idle: "neutral",
  offline: "neutral",
} as const

export function AuthMenu() {
  const { user, loading, configured, signOut } = useAuth()
  const { status } = useSync()

  if (!configured) {
    return <Badge tone="neutral">Local only</Badge>
  }

  if (loading) {
    return <span className="text-xs text-ink-faint">…</span>
  }

  if (!user) {
    return (
      <Link href="/settings" className={buttonClass("secondary", "sm")}>
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge tone={SYNC_TONE[status]}>{status}</Badge>
      <span className="hidden text-xs text-ink-soft sm:inline">
        {user.displayName ?? user.email ?? "Signed in"}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className={buttonClass("ghost", "sm")}
      >
        Sign out
      </button>
    </div>
  )
}
