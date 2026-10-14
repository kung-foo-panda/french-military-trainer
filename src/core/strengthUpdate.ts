import {
  BASE_INTERVAL_DAYS,
  STRENGTH_REINSERT_THRESHOLD,
  type ConceptState,
} from "../types/conceptState"

export type StrengthUpdateResult = {
  state: ConceptState
  /** Day 4: same concept must return in this session */
  reinsert: boolean
}

/** Day 4 / Day 29 — tunable strength dynamics (values set by the Day 29 study). */
export const CORRECT_STRENGTH_GAIN = 5
export const WRONG_STRENGTH_PENALTY = 20
export const STABILITY_GROWTH = 2

export type StrengthParams = {
  correctGain?: number
  wrongPenalty?: number
  stabilityGrowth?: number
}

/**
 * Day 4 / Day 29 — Aggressive strength model.
 * Correct: +gain strength, +growth stability
 * Wrong: -penalty strength, stability = 1, failureCount++
 * strength < 40 → reinsert same session
 */
export function updateStrength(
  concept: ConceptState,
  correct: boolean,
  now: number = Date.now(),
  params: StrengthParams = {}
): StrengthUpdateResult {
  const correctGain = params.correctGain ?? CORRECT_STRENGTH_GAIN
  const wrongPenalty = params.wrongPenalty ?? WRONG_STRENGTH_PENALTY
  const stabilityGrowth = params.stabilityGrowth ?? STABILITY_GROWTH

  const updated: ConceptState = {
    ...concept,
    lastReviewed: now,
  }

  if (correct) {
    updated.strength = Math.min(100, updated.strength + correctGain)
    updated.stability += stabilityGrowth
  } else {
    updated.strength = Math.max(0, updated.strength - wrongPenalty)
    updated.stability = 1
    updated.failureCount += 1
  }

  let intervalDays = BASE_INTERVAL_DAYS * updated.stability
  if (updated.failureCount > 2) {
    intervalDays = 1
  }

  updated.nextReview = now + intervalDays * 24 * 60 * 60 * 1000

  const reinsert =
    !correct && updated.strength < STRENGTH_REINSERT_THRESHOLD

  return { state: updated, reinsert }
}
