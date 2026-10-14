"use client"

import { useSyncExternalStore } from "react"
import {
  getSyncState,
  requestSync,
  subscribeSyncState,
  type SyncState,
} from "./syncStore"

export type SyncApi = SyncState & { syncNow: () => void }

export function useSync(): SyncApi {
  const state = useSyncExternalStore(subscribeSyncState, getSyncState, getSyncState)
  return { ...state, syncNow: requestSync }
}
