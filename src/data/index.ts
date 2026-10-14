import type { ProgressRepository } from "./ProgressRepository"
import { LocalProgressRepository } from "./local/LocalProgressRepository"

export * from "./schema"
export * from "./ProgressRepository"
export * from "./local/LocalProgressRepository"
export * from "./local/guards"

let singleton: ProgressRepository | null = null

/** App-wide repository, or null during server rendering / static export. */
export function progressRepository(): ProgressRepository | null {
  if (typeof window === "undefined") return null
  if (!singleton) singleton = new LocalProgressRepository(window.localStorage)
  return singleton
}
