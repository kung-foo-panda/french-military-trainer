import {
  VERB_GROUPS,
  type Person6,
  type VerbGroup,
} from "../grammar/verbGroups"
import { pick } from "./random"
import type {
  ConjugateErConcept,
  ConjugateIrConcept,
  ConjugateReConcept,
  ConjugateRegularConcept,
} from "../types/concept"
import type { Question } from "../types/question"

type RegularConcept =
  | ConjugateErConcept
  | ConjugateIrConcept
  | ConjugateReConcept
  | ConjugateRegularConcept

const GROUP_BY_KIND: Record<
  "conjugate_er" | "conjugate_ir" | "conjugate_re",
  VerbGroup
> = {
  conjugate_er: "er",
  conjugate_ir: "ir",
  conjugate_re: "re",
}

/**
 * -ER concepts target a specific slot ("plural" spans nous/vous/ils).
 * -IR / -RE concepts (Day 16, C9/C10) drill a random person.
 */
function candidatePersons(concept: RegularConcept): Person6[] {
  if (concept.kind === "conjugate_er") {
    return concept.slot === "plural"
      ? ["1p", "2p", "3p"]
      : [concept.slot]
  }
  return ["1s", "2s", "3s", "1p", "2p", "3p"]
}

/** Day 5 / Day 16 / Day 26 — random subject + subject-less regular verb → conjugated phrase. */
export function generateRegularQuestion(concept: RegularConcept): Question {
  const group =
    concept.kind === "conjugate_regular"
      ? pick<VerbGroup>(["er", "ir", "re"])
      : GROUP_BY_KIND[concept.kind]
  const config = VERB_GROUPS[group]
  const person = pick(candidatePersons(concept))
  const form = pick(config.forms[person])
  const infinitive = pick(config.verbs)
  const stem = config.stem(infinitive)
  const conjugated = `${form.subject} ${stem}${form.ending}`

  return {
    conceptId: concept.id,
    concept: concept.name,
    promptKey: "prompt.conjugate",
    promptParams: { subject: form.subject, phrase: infinitive },
    french: infinitive,
    answers: [conjugated],
    mode: "conjugate",
    subject: form.subject,
    infinitive,
    stem,
    expectedEnding: form.ending,
  }
}
