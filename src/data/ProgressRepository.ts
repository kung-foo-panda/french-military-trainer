import type { EnforcementRecord } from "../core/dailyEnforcement"
import type { DailyMetrics } from "../core/dailyMetrics"
import type { ConceptState } from "../types/conceptState"
import type { ProgressSnapshot } from "./schema"

/**
 * Phase 2 — storage port. The training UI depends on this interface only, so a
 * Firestore-backed implementation can be swapped in for multi-device sync
 * without touching the engine or components.
 */
export interface ProgressRepository {
  loadSnapshot(): ProgressSnapshot
  saveSnapshot(snapshot: ProgressSnapshot): void
  loadConceptStates(): ConceptState[]
  saveConceptStates(states: ConceptState[]): void
  loadEnforcement(): EnforcementRecord
  saveEnforcement(record: EnforcementRecord): void
  /** Metrics for `date`, or an empty record when the stored day differs. */
  loadMetrics(date: string): DailyMetrics
  saveMetrics(metrics: DailyMetrics): void
  clear(): void
}
