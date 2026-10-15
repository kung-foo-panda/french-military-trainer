import { pick } from "../random"
import type { TranslateConcept } from "../../types/concept"
import type { Question } from "../../types/question"

/** Random example phrase → English translation drill. */
export function generateTranslateQuestion(concept: TranslateConcept): Question {
  const example = pick(concept.examples)

  return {
    conceptId: concept.id,
    concept: concept.name,
    promptKey: "prompt.translate",
    promptParams: { phrase: example.french },
    french: example.french,
    answers: example.english,
    mode: "translate",
  }
}
