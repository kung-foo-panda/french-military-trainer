import { ETRE_PARTICIPLES, ETRE_VERBS } from "../grammar/etreVerbs"
import { pick } from "./random"
import type { EtreAgreementConcept } from "../types/concept"
import type { Question } from "../types/question"

const SUBJECTS = [
  { subject: "il", feminine: false },
  { subject: "elle", feminine: true },
] as const

/**
 * Day 19 — C20: passé composé with être for a singular subject.
 * Feminine subjects add -e to the participle (elle est allée).
 */
export function generateEtreAgreementQuestion(
  concept: EtreAgreementConcept
): Question {
  const { subject, feminine } = pick(SUBJECTS)
  const infinitive = pick(ETRE_VERBS)
  const participleBase = ETRE_PARTICIPLES[infinitive]
  const agreement = feminine ? "e" : ""
  const auxiliary = "est"
  const conjugated = `${subject} ${auxiliary} ${participleBase}${agreement}`

  return {
    conceptId: concept.id,
    concept: concept.name,
    question: `Passé composé (être): ${subject} + ${infinitive}`,
    french: infinitive,
    answers: [conjugated],
    mode: "etre_pc",
    subject,
    infinitive,
    auxiliary,
    participle: participleBase,
    agreement,
  }
}
