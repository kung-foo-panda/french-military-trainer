import { ER_VERBS } from "../grammar/erVerbs"
import { ALLER_FORMS } from "../grammar/irregularVerbs"
import { pick } from "./random"
import type { FuturProcheConcept } from "../types/concept"
import type { Question } from "../types/question"

/**
 * Day 26 — futur proche: aller (present) + infinitive (je vais parler).
 */
export function generateFuturProcheQuestion(
  concept: FuturProcheConcept
): Question {
  const aller = pick(ALLER_FORMS)
  const infinitive = pick(ER_VERBS)

  return {
    conceptId: concept.id,
    concept: concept.name,
    question: `Futur proche: ${aller.subject} + ${infinitive}`,
    french: infinitive,
    answers: [`${aller.form} ${infinitive}`],
    mode: "futur_proche",
    subject: aller.subject,
    infinitive,
    auxiliary: aller.form,
  }
}
