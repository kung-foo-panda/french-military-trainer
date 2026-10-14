import { progressRepository } from "../data"
import { createInitialConceptState, type ConceptState } from "../types/conceptState"

export function loadConceptStates(): ConceptState[] {
  return progressRepository()?.loadConceptStates() ?? []
}

export function saveConceptStates(states: ConceptState[]) {
  progressRepository()?.saveConceptStates(states)
}

/**
 * Merge stored states with seeds for every concept id that has none yet.
 * Existing states are kept in order — including orphaned ids no longer in the
 * pool — so unknown state is never silently discarded.
 */
export function mergeConceptStates(
  existing: ConceptState[],
  conceptIds: string[]
): ConceptState[] {
  const have = new Set(existing.map((s) => s.id))
  const seeds = conceptIds
    .filter((id) => !have.has(id))
    .map(createInitialConceptState)

  return [...existing, ...seeds]
}
