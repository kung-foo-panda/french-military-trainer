import { AVOIR_FORMS } from "../grammar/auxVerbs"
import { ER_VERBS, erStem } from "../grammar/erVerbs"
import { pick } from "./random"
import type { PasseComposeNegationConcept } from "../types/concept"
import type { Question } from "../types/question"

/** Day 11 — negative passé composé: ne + avoir + pas + participle. */
export function generateNegationQuestion(
  concept: PasseComposeNegationConcept
): Question {
  const infinitive = pick(ER_VERBS)
  const aux = pick(AVOIR_FORMS)
  const participle = `${erStem(infinitive)}é`
  const phrase = `${aux.subject} n'${aux.verb} pas ${participle}`

  return {
    conceptId: concept.id,
    concept: concept.name,
    question: `Négation: ${aux.subject} / ${infinitive}`,
    french: infinitive,
    answers: [phrase],
    mode: "negation",
    subject: aux.subject,
    infinitive,
    auxiliary: aux.form,
    participle,
  }
}
