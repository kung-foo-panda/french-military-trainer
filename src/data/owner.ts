/** Phase 3 — which account the local snapshot currently belongs to. */
const OWNER_KEY = "french_trainer_progress_owner"

export function readOwner(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(OWNER_KEY)
}

export function writeOwner(uid: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(OWNER_KEY, uid)
}
