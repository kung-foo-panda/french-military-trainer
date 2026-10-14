"use client"

import { useEffect } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { progressRepository } from "@/data"
import { subscribeProgress } from "@/data/events"
import { readOwner, writeOwner } from "@/data/owner"
import { FirestoreProgressRepository } from "@/data/firestore/FirestoreProgressRepository"
import { ProgressSync } from "@/data/sync/ProgressSync"
import { setSyncRequester, setSyncState } from "./syncStore"

const PUSH_DEBOUNCE_MS = 1500

/**
 * Phase 3 — drives cloud sync off the auth state. On sign-in it pulls + merges
 * the remote snapshot once, then pushes local changes (debounced). Renders
 * nothing; status is read via `useSync`.
 */
export function SyncManager() {
  const { user, configured } = useAuth()
  const uid = configured && user ? user.uid : null

  useEffect(() => {
    if (!uid) {
      setSyncState({ status: configured ? "idle" : "offline" })
      return
    }

    const local = progressRepository()
    if (!local) return

    const sync = new ProgressSync(new FirestoreProgressRepository(), local)
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const runPull = () => {
      setSyncState({ status: "syncing" })
      const owner = readOwner()
      const reconcile =
        owner === null || owner === uid
          ? sync.pull(uid) // first sign-in adopts local data; same user merges
          : sync.replaceWithRemote(uid) // different user: remote wins
      reconcile
        .then(() => {
          writeOwner(uid)
          if (cancelled) return
          setSyncState({ status: "synced", lastSyncedAt: new Date().getTime() })
        })
        .catch(() => {
          if (!cancelled) setSyncState({ status: "error" })
        })
    }

    setSyncRequester(runPull)
    runPull()

    const unsubscribe = subscribeProgress(() => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        sync
          .push(uid)
          .then(() => {
            if (cancelled) return
            setSyncState({ status: "synced", lastSyncedAt: new Date().getTime() })
          })
          .catch(() => {
            if (!cancelled) setSyncState({ status: "error" })
          })
      }, PUSH_DEBOUNCE_MS)
    })

    return () => {
      cancelled = true
      setSyncRequester(null)
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [uid, configured])

  return null
}
