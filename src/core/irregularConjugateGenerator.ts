import { AVOIR_FORMS, ETRE_FORMS, type AuxForm } from "../grammar/auxVerbs"
import { ALLER_FORMS, FAIRE_FORMS } from "../grammar/irregularVerbs"
import { pick } from "./random"
import type { ConjugateIrregularConcept, IrregularVerb } from "../types/concept"
import type { Question } from "../types/question"

const INFINITIVES: Record<IrregularVerb, string> = {
  etre: "être",
  avoir: "avoir",
  aller: "aller",
  faire: "faire",
}

function formsFor(verb: IrregularVerb): AuxForm[] {
  if (verb === "etre") return ETRE_FORMS
  if (verb === "avoir") return AVOIR_FORMS
  if (verb === "aller") return ALLER_FORMS
  return FAIRE_FORMS
}

/** Day 8 — random subject + être/avoir → full conjugated phrase. */
export function generateIrregularQuestion(
  concept: ConjugateIrregularConcept
): Question {
  const infinitive = INFINITIVES[concept.verb]
  const form = pick(formsFor(concept.verb))

  return {
    conceptId: concept.id,
    concept: concept.name,
    question: `Conjugate: ${form.subject} + ${infinitive}`,
    french: infinitive,
    answers: [form.form],
    mode: "conjugate",
    subject: form.subject,
    infinitive,
  }
}
