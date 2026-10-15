import { AVOIR_FORMS } from "../grammar/auxVerbs"
import { ER_VERBS, erStem } from "../grammar/erVerbs"
import { pick } from "./random"
import type { PasseComposeAvoirConcept } from "../types/concept"
import type { Question } from "../types/question"

/** Day 10 — subject + ER verb → passé composé (avoir + participle). */
export function generatePasseComposeQuestion(
  concept: PasseComposeAvoirConcept
): Question {
  const infinitive = pick(ER_VERBS)
  const aux = pick(AVOIR_FORMS)
  const participle = `${erStem(infinitive)}é`
  const phrase = `${aux.form} ${participle}`

  return {
    conceptId: concept.id,
    concept: concept.name,
    promptKey: "prompt.passeCompose",
    promptParams: { subject: aux.subject, phrase: infinitive },
    french: infinitive,
    answers: [phrase],
    mode: "passe_compose",
    subject: aux.subject,
    infinitive,
    auxiliary: aux.form,
    participle,
  }
}
