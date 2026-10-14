import type { Concept } from "../../types/concept"
import type { Question } from "../../types/question"

export type GeneratorFn<C extends Concept = Concept> = (concept: C) => Question

/**
 * Day 20 — concept kind → generator. The mapped type fails to compile if a
 * new kind is added without wiring a generator for it.
 */
export type GeneratorMap = {
  [K in Concept["kind"]]: GeneratorFn<Extract<Concept, { kind: K }>>
}
