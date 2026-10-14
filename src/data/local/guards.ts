import type { EnforcementRecord } from "../../core/dailyEnforcement"
import type { DailyMetrics, SessionMetric } from "../../core/dailyMetrics"
import type { ConceptState } from "../../types/conceptState"

export function isConceptState(value: unknown): value is ConceptState {
  if (typeof value !== "object" || value === null) return false

  const s = value as Partial<ConceptState>
  return (
    typeof s.id === "string" &&
    typeof s.strength === "number" &&
    typeof s.stability === "number" &&
    typeof s.failureCount === "number" &&
    typeof s.lastReviewed === "number" &&
    typeof s.nextReview === "number"
  )
}

export function isEnforcementRecord(value: unknown): value is EnforcementRecord {
  if (typeof value !== "object" || value === null) return false

  const r = value as Partial<EnforcementRecord>
  return (
    (r.lastActiveDate === null || typeof r.lastActiveDate === "string") &&
    typeof r.streakDays === "number" &&
    typeof r.targetToday === "number" &&
    typeof r.completedToday === "number" &&
    typeof r.skipDebt === "boolean"
  )
}

export function isSessionMetric(value: unknown): value is SessionMetric {
  if (typeof value !== "object" || value === null) return false
  const s = value as Partial<SessionMetric>
  return (
    typeof s.startedAt === "number" &&
    typeof s.durationMs === "number" &&
    typeof s.correct === "number" &&
    typeof s.incorrect === "number" &&
    typeof s.totalTimeMs === "number" &&
    typeof s.conceptStats === "object" &&
    s.conceptStats !== null
  )
}

export function isDailyMetrics(value: unknown): value is DailyMetrics {
  if (typeof value !== "object" || value === null) return false
  const m = value as Partial<DailyMetrics>
  return (
    typeof m.date === "string" &&
    Array.isArray(m.sessions) &&
    m.sessions.every(isSessionMetric)
  )
}
