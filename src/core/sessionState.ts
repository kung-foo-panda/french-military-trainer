import { SESSION_LENGTH } from "../types/conceptState"

export type SessionState = {
  correct: number
  incorrect: number
  streak: number
  /** Exercises completed this session */
  completed: number
  /** Target exercises (Day 3: 25) */
  targetLength: number
  finished: boolean
  /** Force next drill onto this concept id (Day 4 reinsert) */
  forceConceptId: string | null
  /** Day 22: total time spent answering this session (ms) */
  totalTimeMs: number
}

export function createSessionState(
  targetLength: number = SESSION_LENGTH
): SessionState {
  return {
    correct: 0,
    incorrect: 0,
    streak: 0,
    completed: 0,
    targetLength,
    finished: false,
    forceConceptId: null,
    totalTimeMs: 0,
  }
}
