import { SESSION_LENGTH } from "../types/conceptState"

/** Day 21 — daily discipline state, persisted separately from concept states. */
export type EnforcementRecord = {
  /** Local YYYY-MM-DD of the most recent day with activity. */
  lastActiveDate: string | null
  /** Consecutive days that met the daily target. */
  streakDays: number
  /** Exercises required today (BASE, or ESCALATED after a skipped day). */
  targetToday: number
  /** Exercises completed today. */
  completedToday: number
  /** True when today's target was escalated because yesterday was missed. */
  skipDebt: boolean
}

export const BASE_DAILY_TARGET = SESSION_LENGTH
export const ESCALATED_DAILY_TARGET = 40

export const DEFAULT_ENFORCEMENT: EnforcementRecord = {
  lastActiveDate: null,
  streakDays: 0,
  targetToday: BASE_DAILY_TARGET,
  completedToday: 0,
  skipDebt: false,
}

/** Local date key (YYYY-MM-DD), not UTC. */
export function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function toUTC(key: string): number {
  const [y, m, d] = key.split("-").map(Number)
  return Date.UTC(y, m - 1, d)
}

/** Whole days between two local date keys (to - from). */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUTC(to) - toUTC(from)) / 86_400_000)
}

/**
 * Day 21 — resolve today's plan, rolling the record forward to `today`.
 * - 0 missed days  → base target.
 * - 1 missed day   → escalate today to 40 (skip debt).
 * - 2+ missed days → reset the daily streak, back to base target.
 * Idempotent when called again on the same day.
 */
export function resolveDailyPlan(
  record: EnforcementRecord,
  today: string
): EnforcementRecord {
  if (record.lastActiveDate === today) return record

  let streakDays = record.streakDays
  let targetToday = BASE_DAILY_TARGET
  let skipDebt = false

  if (record.lastActiveDate) {
    const missed = daysBetween(record.lastActiveDate, today) - 1
    if (missed === 1) {
      targetToday = ESCALATED_DAILY_TARGET
      skipDebt = true
    } else if (missed >= 2) {
      streakDays = 0
    }
  }

  return {
    lastActiveDate: today,
    streakDays,
    targetToday,
    completedToday: 0,
    skipDebt,
  }
}

/**
 * Day 21 — record one answered exercise for today. Increments the streak once
 * the daily target is met and clears any skip debt.
 */
export function recordCompletion(
  record: EnforcementRecord,
  today: string
): { record: EnforcementRecord; dayComplete: boolean } {
  const rolled =
    record.lastActiveDate === today ? record : resolveDailyPlan(record, today)

  if (rolled.completedToday >= rolled.targetToday) {
    return { record: rolled, dayComplete: true }
  }

  const completedToday = rolled.completedToday + 1
  const dayComplete = completedToday >= rolled.targetToday

  return {
    record: {
      ...rolled,
      completedToday,
      streakDays: dayComplete ? rolled.streakDays + 1 : rolled.streakDays,
      skipDebt: dayComplete ? false : rolled.skipDebt,
    },
    dayComplete,
  }
}
