export type SyncStatus = "offline" | "idle" | "syncing" | "synced" | "error"

export type SyncState = {
  status: SyncStatus
  lastSyncedAt: number | null
}

let state: SyncState = { status: "offline", lastSyncedAt: null }
const listeners = new Set<() => void>()

let requester: (() => void) | null = null

export function getSyncState(): SyncState {
  return state
}

/** Registered by SyncManager so UI can trigger a manual sync. */
export function setSyncRequester(fn: (() => void) | null): void {
  requester = fn
}

export function requestSync(): void {
  requester?.()
}

export function setSyncState(next: Partial<SyncState>): void {
  state = { ...state, ...next }
  for (const listener of listeners) listener()
}

export function subscribeSyncState(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
