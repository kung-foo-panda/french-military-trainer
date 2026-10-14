import { concepts, schedulableConceptIds } from "../grammar/concepts"
import { GENERATOR_BY_KIND } from "./generators/registry"
import type { GeneratorFn } from "./generators/types"
import { isMastered } from "./escalation"
import { escalateQuestion } from "./escalationGenerator"
import { selectNextConceptState } from "./scheduler"
import { isWeaknessSlot, weakestConceptId } from "./weakness"
import type { Concept } from "../types/concept"
import type { ConceptState } from "../types/conceptState"
import type { Question } from "../types/question"

export type { Question }

export type PlannedQuestion = {
  question: Question
  /** True when this drill was forced onto the hunted weak concept. */
  weakness: boolean
}

const SCHEDULABLE_IDS = new Set(schedulableConceptIds)

/**
 * Day 20 — concept kind → generator lookup. The index needs one cast because
 * the mapped-type values each expect a narrowed concept while `concept` is the
 * full union at this call site.
 */
function buildQuestion(concept: Concept): Question {
  const generate = GENERATOR_BY_KIND[concept.kind] as GeneratorFn<Concept>
  return generate(concept)
}

/** Day 23 — escalate the drill when its concept is already mastered. */
function buildFor(states: ConceptState[], concept: Concept): Question {
  const question = buildQuestion(concept)
  const state = states.find((s) => s.id === concept.id)
  return state && isMastered(state) ? escalateQuestion(question, concept) : question
}

function conceptById(id: string): Concept {
  const found = concepts.find((c) => c.id === id)
  if (!found) {
    throw new Error(`Unknown concept id: ${id}`)
  }
  return found
}

/**
 * Pick next drill using extreme scheduler, or forced reinsert id.
 * Only schedulable concepts (Day 12) enter the mixed-session pool.
 */
export function selectNextConcept(
  states: ConceptState[],
  forceConceptId: string | null = null
): Concept {
  if (forceConceptId) {
    return conceptById(forceConceptId)
  }

  const pool = states.filter((s) => SCHEDULABLE_IDS.has(s.id))
  const next = selectNextConceptState(pool)
  return conceptById(next.id)
}

/**
 * Day 13 — weakness-aware planning.
 * - Reinsert (forceConceptId) always wins.
 * - On ~40% of slots, hunt the weakest concept below threshold.
 * - On the remaining slots, schedule normally but exclude the weak
 *   concept so its share stays near 40% rather than dominating.
 */
export function planNextQuestion(
  states: ConceptState[],
  questionIndex: number,
  forceConceptId: string | null = null
): PlannedQuestion {
  if (forceConceptId) {
    return {
      question: buildFor(states, conceptById(forceConceptId)),
      weakness: false,
    }
  }

  const pool = states.filter((s) => SCHEDULABLE_IDS.has(s.id))
  const weakId = weakestConceptId(pool)

  if (weakId && isWeaknessSlot(questionIndex)) {
    return {
      question: buildFor(states, conceptById(weakId)),
      weakness: true,
    }
  }

  const normalPool = weakId ? pool.filter((s) => s.id !== weakId) : pool
  const next = selectNextConceptState(normalPool.length > 0 ? normalPool : pool)
  return {
    question: buildFor(states, conceptById(next.id)),
    weakness: false,
  }
}
