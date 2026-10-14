import type { ProgressSnapshot } from "../schema"

/** Phase 3 — async storage port for remote (per-user) persistence. */
export interface AsyncProgressRepository {
  load(uid: string): Promise<ProgressSnapshot | null>
  save(uid: string, snapshot: ProgressSnapshot): Promise<void>
}
