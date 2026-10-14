import { AUX_CHOICES, AVOIR_VERBS } from "../grammar/etreVerbs"
import { pick } from "./random"
import type { AuxiliaryIntroConcept } from "../types/concept"
import type { Question } from "../types/question"

/**
 * Day 26 — C14: default auxiliary is avoir for ordinary verbs. Recognition
 * only; être verbs are handled by C19.
 */
export function generateAuxiliaryIntroQuestion(
  concept: AuxiliaryIntroConcept
): Question {
  const infinitive = pick(AVOIR_VERBS)

  return {
    conceptId: concept.id,
    concept: concept.name,
    question: `Which auxiliary for "${infinitive}"?`,
    french: infinitive,
    answers: ["avoir"],
    mode: "auxiliary",
    auxiliary: "avoir",
    choices: [...AUX_CHOICES],
  }
}
