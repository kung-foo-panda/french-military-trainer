import { IRREGULAR_FORMS } from "../grammar/irregularVerbs"
import { pick } from "./random"
import type { ConjugateIrregularConcept, IrregularVerb } from "../types/concept"
import type { Question } from "../types/question"

const INFINITIVES: Record<IrregularVerb, string> = {
  etre: "être",
  avoir: "avoir",
  aller: "aller",
  faire: "faire",
  venir: "venir",
  prendre: "prendre",
  pouvoir: "pouvoir",
  vouloir: "vouloir",
  devoir: "devoir",
  voir: "voir",
  dire: "dire",
  mettre: "mettre",
}

/** Day 8 / Phase 6 — random subject + irregular verb → full conjugated phrase. */
export function generateIrregularQuestion(
  concept: ConjugateIrregularConcept
): Question {
  const infinitive = INFINITIVES[concept.verb]
  const form = pick(IRREGULAR_FORMS[concept.verb])

  return {
    conceptId: concept.id,
    concept: concept.name,
    promptKey: "prompt.conjugate",
    promptParams: { subject: form.subject, phrase: infinitive },
    french: infinitive,
    answers: [form.form],
    mode: "conjugate",
    subject: form.subject,
    infinitive,
  }
}
