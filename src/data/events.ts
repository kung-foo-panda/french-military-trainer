import type { ProgressSnapshot } from "./schema"

/**
 * Phase 3 — in-process notification that local progress changed. The cloud
 * sync service subscribes and pushes snapshots without the storage layer
 * knowing anything about Firebase.
 */
type ProgressListener = (snapshot: ProgressSnapshot) => void

const listeners = new Set<ProgressListener>()

export function subscribeProgress(listener: ProgressListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function emitProgress(snapshot: ProgressSnapshot): void {
  for (const listener of listeners) listener(snapshot)
}
