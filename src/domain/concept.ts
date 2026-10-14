import type { Concept } from "../types/concept"
import type { Chapter } from "./chapter"
import type { Example } from "./example"
import type { ExerciseTypeId } from "./exerciseType"
import type { SourceRef } from "./provenance"
import type { Rule } from "./rule"

/**
 * Phase 2 — the UI-agnostic, stable taxonomy layer. A `DomainConcept` wraps a
 * runtime concept id with chapter/rule/example references, exercise-type
 * coverage, provenance, and dependency metadata, without changing the
 * pedagogical `Concept` union the engine consumes.
 */
export type DomainConcept = {
  id: string
  name: string
  explanation: string
  difficulty: number
  kind: Concept["kind"]
  chapterId: string
  ruleIds: string[]
  exampleIds: string[]
  exerciseTypes: ExerciseTypeId[]
  trainable: boolean
  dependencies: string[]
  /** True when a matching runtime concept exists in the training pool. */
  runtime: boolean
  source: SourceRef
}

export type Catalog = {
  chapters: Chapter[]
  rules: Rule[]
  examples: Example[]
  concepts: DomainConcept[]
}
