import {
  AUX_CHOICES,
  AVOIR_VERBS,
  ETRE_VERBS,
} from "../grammar/etreVerbs"
import { pick } from "./random"
import type { EtreVerbSetConcept } from "../types/concept"
import type { Question } from "../types/question"

/**
 * Day 18 — C19: pick the correct auxiliary for a verb (être vs avoir).
 * Movement verbs take être; the rest take avoir. Recognition only.
 */
export function generateEtreSetQuestion(
  concept: EtreVerbSetConcept
): Question {
  const isEtre = Math.random() < 0.6
  const infinitive = pick(isEtre ? ETRE_VERBS : AVOIR_VERBS)
  const auxiliary = isEtre ? "être" : "avoir"

  return {
    conceptId: concept.id,
    concept: concept.name,
    question: `Which auxiliary for "${infinitive}"?`,
    french: infinitive,
    answers: [auxiliary],
    mode: "auxiliary",
    auxiliary,
    choices: [...AUX_CHOICES],
  }
}
