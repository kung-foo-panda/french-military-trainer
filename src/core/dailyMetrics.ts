/**
 * Day 28 — daily stress-test metrics. Aggregates the per-answer data already
 * produced by a session (Day 22 timing + Day 27 concept stats) across the
 * sessions of a single day so cognitive load can be measured (3 × 25 = 75).
 */

export type ConceptMetric = {
  name: string
  correct: number
  total: number
}

export type SessionMetric = {
  startedAt: number
  durationMs: number
  correct: number
  incorrect: number
  totalTimeMs: number
  conceptStats: Record<string, ConceptMetric>
}

export type DailyMetrics = {
  /** Local YYYY-MM-DD this record belongs to. */
  date: string
  sessions: SessionMetric[]
}

export type ConceptSummary = {
  id: string
  name: string
  correct: number
  total: number
  accuracy: number
}

export type StressReport = {
  date: string
  sessionCount: number
  answers: number
  correct: number
  accuracy: number
  avgAnswerMs: number
  /** Accuracy (0..1) per session, in order. */
  accuracyBySession: number[]
  /** Mean ms per answer per session, in order. */
  avgMsBySession: number[]
  /** First-session accuracy minus last-session accuracy (cognitive decay). */
  degradation: number
  /** Last-session mean answer time minus first-session mean (fatigue). */
  slowdownMs: number
  concepts: ConceptSummary[]
  weakestConcept: ConceptSummary | null
}

export const STRESS_SESSIONS = 3
export const STRESS_ANSWERS = STRESS_SESSIONS * 25

export function emptyDailyMetrics(date: string): DailyMetrics {
  return { date, sessions: [] }
}

export function appendSession(
  metrics: DailyMetrics,
  session: SessionMetric
): DailyMetrics {
  return { ...metrics, sessions: [...metrics.sessions, session] }
}

export function computeStressReport(metrics: DailyMetrics): StressReport {
  const sessions = metrics.sessions

  let answers = 0
  let correct = 0
  let totalTimeMs = 0
  const accuracyBySession: number[] = []
  const avgMsBySession: number[] = []
  const conceptTotals: Record<string, ConceptSummary> = {}

  for (const s of sessions) {
    const total = s.correct + s.incorrect
    answers += total
    correct += s.correct
    totalTimeMs += s.totalTimeMs
    accuracyBySession.push(total > 0 ? s.correct / total : 0)
    avgMsBySession.push(total > 0 ? s.totalTimeMs / total : 0)

    for (const [id, c] of Object.entries(s.conceptStats)) {
      const cur =
        conceptTotals[id] ??
        { id, name: c.name, correct: 0, total: 0, accuracy: 0 }
      cur.correct += c.correct
      cur.total += c.total
      conceptTotals[id] = cur
    }
  }

  const concepts = Object.values(conceptTotals)
    .map((c) => ({ ...c, accuracy: c.total > 0 ? c.correct / c.total : 0 }))
    .sort((a, b) => b.total - a.total)

  const weakestConcept =
    [...concepts]
      .filter((c) => c.total > 0)
      .sort((a, b) => a.accuracy - b.accuracy)[0] ?? null

  const first = avgMsBySession[0] ?? 0
  const last = avgMsBySession[avgMsBySession.length - 1] ?? 0
  const firstAcc = accuracyBySession[0] ?? 0
  const lastAcc = accuracyBySession[accuracyBySession.length - 1] ?? 0

  return {
    date: metrics.date,
    sessionCount: sessions.length,
    answers,
    correct,
    accuracy: answers > 0 ? correct / answers : 0,
    avgAnswerMs: answers > 0 ? totalTimeMs / answers : 0,
    accuracyBySession,
    avgMsBySession,
    degradation: firstAcc - lastAcc,
    slowdownMs: last - first,
    concepts,
    weakestConcept,
  }
}
