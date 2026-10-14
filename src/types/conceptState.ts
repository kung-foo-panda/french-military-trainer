/** Battlefield unit for the extreme military scheduler (Days 3–4). */
export type ConceptState = {
  id: string
  /** 0–100; rises slowly, drops hard on failure */
  strength: number
  /** Controls review interval growth */
  stability: number
  failureCount: number
  lastReviewed: number
  nextReview: number
}

export const SESSION_LENGTH = 25
export const STRENGTH_REINSERT_THRESHOLD = 40
export const DEFAULT_STRENGTH = 50
export const BASE_INTERVAL_DAYS = 1

export function createInitialConceptState(id: string): ConceptState {
  return {
    id,
    strength: DEFAULT_STRENGTH,
    stability: 1,
    failureCount: 0,
    lastReviewed: 0,
    nextReview: Date.now(),
  }
}
