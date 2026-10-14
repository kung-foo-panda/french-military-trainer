import { concepts, schedulableConceptIds } from "../grammar/concepts"
import {
  exerciseTypesForConcept,
  type ExerciseTypeId,
} from "../domain/exerciseType"
import type { Concept } from "../types/concept"

/**
 * Phase 4 — a learner-chosen restriction over the schedulable pool. Every
 * filter is `null` when unset ("no restriction"); an empty array is treated the
 * same as `null` at the UI boundary so a cleared selection means "everything".
 */
export type TrainingPlan = {
  chapterIds: string[] | null
  conceptIds: string[] | null
  exerciseTypes: ExerciseTypeId[] | null
}

export const DEFAULT_TRAINING_PLAN: TrainingPlan = {
  chapterIds: null,
  conceptIds: null,
  exerciseTypes: null,
}

const BY_ID = new Map<string, Concept>(concepts.map((c) => [c.id, c]))

export function isDefaultTrainingPlan(plan: TrainingPlan): boolean {
  return (
    plan.chapterIds === null &&
    plan.conceptIds === null &&
    plan.exerciseTypes === null
  )
}

/**
 * Phase 4 — narrow the schedulable pool to the ids a plan allows. Unknown ids
 * simply match nothing; the result may be empty when a plan is contradictory.
 */
export function resolveTrainingPool(
  plan: TrainingPlan = DEFAULT_TRAINING_PLAN
): string[] {
  const conceptFilter = plan.conceptIds ? new Set(plan.conceptIds) : null
  const chapterFilter = plan.chapterIds ? new Set(plan.chapterIds) : null
  const typeFilter = plan.exerciseTypes
    ? new Set<ExerciseTypeId>(plan.exerciseTypes)
    : null

  return schedulableConceptIds.filter((id) => {
    if (conceptFilter && !conceptFilter.has(id)) return false

    const concept = BY_ID.get(id)
    if (!concept) return false

    if (
      chapterFilter &&
      !(concept.chapterId && chapterFilter.has(concept.chapterId))
    ) {
      return false
    }

    if (typeFilter) {
      const types = exerciseTypesForConcept(concept)
      if (!types.some((t) => typeFilter.has(t))) return false
    }

    return true
  })
}
