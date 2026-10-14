import {
  DEFAULT_TRAINING_PLAN,
  type TrainingPlan,
} from "../core/trainingPlan"
import { EXERCISE_TYPES, type ExerciseTypeId } from "../domain/exerciseType"

/** Phase 4 — locally persisted training filter (not synced in Phase 4). */
const PLAN_KEY = "french_trainer_training_plan"

const EXERCISE_TYPE_IDS = new Set<string>(EXERCISE_TYPES.map((t) => t.id))

function asIdList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const ids = value.filter((v): v is string => typeof v === "string")
  return ids.length > 0 ? ids : null
}

function asExerciseTypes(value: unknown): ExerciseTypeId[] | null {
  const ids = asIdList(value)
  if (ids === null) return null
  const valid = ids.filter((id): id is ExerciseTypeId =>
    EXERCISE_TYPE_IDS.has(id)
  )
  return valid.length > 0 ? valid : null
}

/** Tolerates any stored shape; unknown ids and empty lists become "no filter". */
export function normalizeTrainingPlan(value: unknown): TrainingPlan {
  if (typeof value !== "object" || value === null) {
    return { ...DEFAULT_TRAINING_PLAN }
  }
  const plan = value as Partial<TrainingPlan>
  return {
    chapterIds: asIdList(plan.chapterIds),
    conceptIds: asIdList(plan.conceptIds),
    exerciseTypes: asExerciseTypes(plan.exerciseTypes),
  }
}

export function loadTrainingPlan(): TrainingPlan {
  if (typeof window === "undefined") return { ...DEFAULT_TRAINING_PLAN }
  const raw = window.localStorage.getItem(PLAN_KEY)
  if (!raw) return { ...DEFAULT_TRAINING_PLAN }
  try {
    return normalizeTrainingPlan(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_TRAINING_PLAN }
  }
}

export function saveTrainingPlan(plan: TrainingPlan): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan))
}
