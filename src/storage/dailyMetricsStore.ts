import {
  emptyDailyMetrics,
  type DailyMetrics,
  type SessionMetric,
} from "../core/dailyMetrics"

const KEY = "french_trainer_metrics"

function isSessionMetric(value: unknown): value is SessionMetric {
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

function isDailyMetrics(value: unknown): value is DailyMetrics {
  if (typeof value !== "object" || value === null) return false
  const m = value as Partial<DailyMetrics>
  return (
    typeof m.date === "string" &&
    Array.isArray(m.sessions) &&
    m.sessions.every(isSessionMetric)
  )
}

/** Load metrics for `date`, resetting when the stored record is from another day. */
export function loadDailyMetrics(date: string): DailyMetrics {
  if (typeof window === "undefined") return emptyDailyMetrics(date)

  const raw = localStorage.getItem(KEY)
  if (!raw) return emptyDailyMetrics(date)

  try {
    const parsed: unknown = JSON.parse(raw)
    if (isDailyMetrics(parsed) && parsed.date === date) return parsed
    return emptyDailyMetrics(date)
  } catch {
    return emptyDailyMetrics(date)
  }
}

export function saveDailyMetrics(metrics: DailyMetrics) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(metrics))
}
