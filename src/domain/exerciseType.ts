import type { Concept } from "../types/concept"
import type { QuestionMode } from "../types/question"

/**
 * Phase 2 — stable exercise-type identifiers. A concept advertises which
 * exercise types its generator can produce so training selection can reason
 * about coverage independently of the runtime `kind` union.
 */
export type ExerciseTypeId =
  | "translate_phrase"
  | "recognize_subject"
  | "classify_person"
  | "classify_number"
  | "classify_gender"
  | "conjugate_present"
  | "form_participle"
  | "build_passe_compose"
  | "negate_passe_compose"
  | "choose_auxiliary"
  | "apply_agreement"
  | "express_near_future"

export type ExerciseType = {
  id: ExerciseTypeId
  label: string
  modes: QuestionMode[]
}

export const EXERCISE_TYPES: ExerciseType[] = [
  { id: "translate_phrase", label: "Translate a phrase", modes: ["translate"] },
  {
    id: "recognize_subject",
    label: "Recognize the subject pronoun",
    modes: ["detect"],
  },
  { id: "classify_person", label: "Classify grammatical person", modes: ["detect"] },
  { id: "classify_number", label: "Classify singular vs plural", modes: ["detect"] },
  { id: "classify_gender", label: "Classify noun gender", modes: ["detect"] },
  {
    id: "conjugate_present",
    label: "Conjugate in the present",
    modes: ["conjugate", "mixed_tense"],
  },
  {
    id: "form_participle",
    label: "Form the past participle",
    modes: ["participle"],
  },
  {
    id: "build_passe_compose",
    label: "Build the passé composé",
    modes: ["passe_compose"],
  },
  {
    id: "negate_passe_compose",
    label: "Negate the passé composé",
    modes: ["negation"],
  },
  { id: "choose_auxiliary", label: "Choose the auxiliary", modes: ["auxiliary"] },
  {
    id: "apply_agreement",
    label: "Apply être agreement",
    modes: ["etre_pc"],
  },
  {
    id: "express_near_future",
    label: "Express the near future",
    modes: ["futur_proche"],
  },
]

const EXERCISE_TYPE_BY_ID = new Map<ExerciseTypeId, ExerciseType>(
  EXERCISE_TYPES.map((t) => [t.id, t])
)

export function exerciseType(id: ExerciseTypeId): ExerciseType {
  const found = EXERCISE_TYPE_BY_ID.get(id)
  if (!found) throw new Error(`unknown exercise type: ${id}`)
  return found
}

/** Stable exercise-type ids produced by a runtime concept's generator. */
export function exerciseTypesForConcept(concept: Concept): ExerciseTypeId[] {
  switch (concept.kind) {
    case "translate":
      return ["translate_phrase"]
    case "detect":
      switch (concept.variant) {
        case "pronoun":
          return ["recognize_subject"]
        case "person":
          return ["classify_person"]
        case "plural":
          return ["classify_number"]
        case "gender":
          return ["classify_gender"]
      }
    case "conjugate_er":
    case "conjugate_ir":
    case "conjugate_re":
    case "conjugate_regular":
    case "conjugate_irregular":
      return ["conjugate_present"]
    case "participle_er":
    case "participle_ir_re":
      return ["form_participle"]
    case "pc_avoir":
      return ["build_passe_compose"]
    case "pc_negation":
      return ["negate_passe_compose"]
    case "pc_etre_set":
    case "auxiliary_intro":
      return ["choose_auxiliary"]
    case "pc_etre_agreement":
      return ["apply_agreement"]
    case "futur_proche":
      return ["express_near_future"]
  }
}
