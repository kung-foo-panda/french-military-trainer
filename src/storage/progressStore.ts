import {
  createInitialConceptState,
  type ConceptState,
} from "../types/conceptState"

/** New key so old SM-2 localStorage payloads are ignored. */
const KEY = "french_trainer_concept_states"

function isConceptState(value: unknown): value is ConceptState {
  if (typeof value !== "object" || value === null) return false

  const s = value as Partial<ConceptState>
  return (
    typeof s.id === "string" &&
    typeof s.strength === "number" &&
    typeof s.stability === "number" &&
    typeof s.failureCount === "number" &&
    typeof s.lastReviewed === "number" &&
    typeof s.nextReview === "number"
  )
}

export function loadConceptStates(): ConceptState[] {
  if (typeof window === "undefined") return []

  const raw = localStorage.getItem(KEY)
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isConceptState)
  } catch {
    return []
  }
}

export function saveConceptStates(states: ConceptState[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(states))
}

/** Ensure every grammar concept id has a ConceptState (seed missing). */
export function ensureConceptStates(
  existing: ConceptState[],
  conceptIds: string[]
): ConceptState[] {
  const map = new Map(existing.map((s) => [s.id, s]))

  for (const id of conceptIds) {
    if (!map.has(id)) {
      map.set(id, createInitialConceptState(id))
    }
  }

  return conceptIds.map((id) => map.get(id)!)
}
