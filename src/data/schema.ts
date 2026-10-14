import {
  DEFAULT_ENFORCEMENT,
  type EnforcementRecord,
} from "../core/dailyEnforcement"
import { emptyDailyMetrics, type DailyMetrics } from "../core/dailyMetrics"
import type { ConceptState } from "../types/conceptState"

/** Phase 2 — bump when the persisted snapshot shape changes. */
export const PROGRESS_SCHEMA_VERSION = 2

/** Single snapshot key; supersedes the three legacy per-store keys. */
export const PROGRESS_KEY = "french_trainer_progress"

export const LEGACY_KEYS = {
  conceptStates: "french_trainer_concept_states",
  enforcement: "french_trainer_enforcement",
  metrics: "french_trainer_metrics",
} as const

export type ProgressSnapshot = {
  version: number
  conceptStates: ConceptState[]
  enforcement: EnforcementRecord
  metrics: DailyMetrics | null
}

export function emptySnapshot(): ProgressSnapshot {
  return {
    version: PROGRESS_SCHEMA_VERSION,
    conceptStates: [],
    enforcement: { ...DEFAULT_ENFORCEMENT },
    metrics: null,
  }
}

export function defaultDailyMetrics(date: string): DailyMetrics {
  return emptyDailyMetrics(date)
}
