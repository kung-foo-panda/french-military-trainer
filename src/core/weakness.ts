import { schedulableConceptIds } from "../grammar/concepts"
import type { ConceptState } from "../types/conceptState"

const SCHEDULABLE_IDS = new Set(schedulableConceptIds)

/** Day 13 — a concept below this strength is "weak". */
export const WEAKNESS_THRESHOLD = 50

/** Day 13 — weak concepts should take this share of a session. */
export const WEAKNESS_SHARE = 0.4

const PERIOD = 5
const WEAK_SLOTS = Math.round(PERIOD * WEAKNESS_SHARE)

/**
 * Day 13 — the single weakest schedulable concept below the threshold,
 * or null when nothing is weak. Ties break on highest failureCount.
 */
export function weakestConceptId(states: ConceptState[]): string | null {
  const weak = states.filter(
    (s) => SCHEDULABLE_IDS.has(s.id) && s.strength < WEAKNESS_THRESHOLD
  )
  if (weak.length === 0) return null

  weak.sort(
    (a, b) => a.strength - b.strength || b.failureCount - a.failureCount
  )
  return weak[0].id
}

/**
 * Day 13 — deterministic 40% interleave: 2 of every 5 question slots are
 * reserved for the weak concept (e.g. indices 0,1,5,6,10,11, …).
 */
export function isWeaknessSlot(questionIndex: number): boolean {
  return questionIndex % PERIOD < WEAK_SLOTS
}
