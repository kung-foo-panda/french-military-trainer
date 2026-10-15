import { isMastered } from "./escalation"
import { WEAKNESS_THRESHOLD } from "./weakness"
import type { ConceptState } from "../types/conceptState"
import type { DailyMetrics } from "./dailyMetrics"

export type MasteryBand = "new" | "fragile" | "developing" | "solid" | "mastered"

type BandDef = { band: MasteryBand; label: string; min: number }

/** Strength cut-offs, highest first so `find` returns the best fit. */
export const MASTERY_BANDS: BandDef[] = [
  { band: "mastered", label: "Mastered", min: 90 },
  { band: "solid", label: "Solid", min: 75 },
  { band: "developing", label: "Developing", min: 50 },
  { band: "fragile", label: "Fragile", min: 25 },
  { band: "new", label: "New", min: 0 },
]

export function masteryBand(strength: number): MasteryBand {
  return (MASTERY_BANDS.find((b) => strength >= b.min) ?? MASTERY_BANDS[MASTERY_BANDS.length - 1]).band
}

export function masteryLabel(strength: number): string {
  return (
    MASTERY_BANDS.find((b) => strength >= b.min)?.label ?? "New"
  )
}

export type MasterySummary = {
  total: number
  /** Engine "mastered" (high strength, few failures, spaced successes). */
  mastered: number
  weak: number
  dueToday: number
  /** 0–100 mean strength across the given states. */
  avgStrength: number
}

export function summarizeMastery(
  states: ConceptState[],
  now: number = Date.now()
): MasterySummary {
  let mastered = 0
  let weak = 0
  let dueToday = 0
  let strengthSum = 0

  for (const state of states) {
    strengthSum += state.strength
    if (isMastered(state)) mastered++
    if (state.strength < WEAKNESS_THRESHOLD) weak++
    if (state.nextReview <= now) dueToday++
  }

  return {
    total: states.length,
    mastered,
    weak,
    dueToday,
    avgStrength: states.length > 0 ? strengthSum / states.length : 0,
  }
}

/** Concepts currently due for review, weakest first. */
export function dueConcepts(
  states: ConceptState[],
  now: number = Date.now()
): ConceptState[] {
  return states
    .filter((s) => s.nextReview <= now)
    .sort((a, b) => a.strength - b.strength || b.failureCount - a.failureCount)
}

/** Concepts below the weakness threshold, weakest first. */
export function weakConcepts(states: ConceptState[]): ConceptState[] {
  return states
    .filter((s) => s.strength < WEAKNESS_THRESHOLD)
    .sort((a, b) => a.strength - b.strength || b.failureCount - a.failureCount)
}

/** Concepts ranked weakest first (progress table order). */
export function weakestFirst(states: ConceptState[]): ConceptState[] {
  return [...states].sort(
    (a, b) => a.strength - b.strength || b.failureCount - a.failureCount
  )
}

export type BandCount = { band: MasteryBand; label: string; count: number }

/** Distribution of states across mastery bands (non-empty bands, best first). */
export function bandDistribution(states: ConceptState[]): BandCount[] {
  return MASTERY_BANDS.map((def) => ({
    band: def.band,
    label: def.label,
    count: states.filter((s) => masteryBand(s.strength) === def.band).length,
  })).filter((entry) => entry.count > 0)
}

export type HistoryPoint = {
  date: string
  answers: number
  correct: number
  accuracy: number
  avgAnswerMs: number
}

/**
 * Collapse daily metrics into one point per practiced day, oldest→newest, and
 * keep the last `limit` days.
 */
export function historySeries(
  history: DailyMetrics[],
  limit = 30
): HistoryPoint[] {
  return history
    .filter((day) => day.sessions.length > 0)
    .map((day) => {
      let answers = 0
      let correct = 0
      let totalTimeMs = 0
      for (const session of day.sessions) {
        answers += session.correct + session.incorrect
        correct += session.correct
        totalTimeMs += session.totalTimeMs
      }
      return {
        date: day.date,
        answers,
        correct,
        accuracy: answers > 0 ? correct / answers : 0,
        avgAnswerMs: answers > 0 ? totalTimeMs / answers : 0,
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit)
}

/** Practiced days only; used to decide when to show an empty state. */
export function practicedDays(history: DailyMetrics[]): number {
  return history.filter((day) => day.sessions.length > 0).length
}
