import type { ConceptState } from "../types/conceptState"

/**
 * Day 3 / Day 29 — overdue priority weight. High enough (default) to reproduce
 * the original "overdue first" ordering, but tunable so Day 29 can test whether
 * weakening it improves retention.
 */
export const OVERDUE_WEIGHT = 200

/**
 * Combined priority score (higher = reviewed sooner):
 *   overdue bonus + weakness (100 - strength) + failure pressure.
 * Deterministic; ties fall back to array order.
 */
export function conceptPriority(
  state: ConceptState,
  now: number = Date.now(),
  overdueWeight: number = OVERDUE_WEIGHT
): number {
  const overdue = state.nextReview <= now ? 1 : 0
  const weakness = 100 - state.strength
  const failurePressure = Math.min(state.failureCount, 5) * 2
  return overdue * overdueWeight + weakness + failurePressure
}

/**
 * Day 3 — Extreme selection:
 * 1. Overdue first
 * 2. Lowest strength
 * 3. Highest failureCount
 * No randomness.
 */
export function selectNextConceptState(
  states: ConceptState[],
  now: number = Date.now(),
  overdueWeight: number = OVERDUE_WEIGHT
): ConceptState {
  if (states.length === 0) {
    throw new Error("selectNextConceptState: no concept states available")
  }

  let best = states[0]
  let bestScore = conceptPriority(best, now, overdueWeight)
  for (let i = 1; i < states.length; i++) {
    const score = conceptPriority(states[i], now, overdueWeight)
    if (score > bestScore) {
      best = states[i]
      bestScore = score
    }
  }
  return best
}

/** Ranked list for debug / session preview (highest priority first). */
export function rankConceptStates(
  states: ConceptState[],
  now: number = Date.now(),
  overdueWeight: number = OVERDUE_WEIGHT
): ConceptState[] {
  return [...states].sort(
    (a, b) =>
      conceptPriority(b, now, overdueWeight) -
      conceptPriority(a, now, overdueWeight)
  )
}
