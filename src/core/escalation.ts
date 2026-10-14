import type { ConceptState } from "../types/conceptState"

/** Day 23 — a concept above this strength is a candidate for escalation. */
export const ESCALATION_THRESHOLD = 85

/**
 * Day 23 — "mastered" mirrors the grammar-concepts.txt stability rule:
 * high strength, few failures, and repeated spaced successes.
 */
export function isMastered(state: ConceptState): boolean {
  return (
    state.strength > ESCALATION_THRESHOLD &&
    state.failureCount < 2 &&
    state.stability >= 3
  )
}
