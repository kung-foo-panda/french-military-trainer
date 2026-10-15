import { VERB_GROUPS, type VerbGroup } from "../grammar/verbGroups"
import { pick } from "./random"
import type {
  ParticipleErConcept,
  ParticipleIrReConcept,
} from "../types/concept"
import type { Question } from "../types/question"

type ParticipleConcept = ParticipleErConcept | ParticipleIrReConcept

function groupFor(concept: ParticipleConcept): VerbGroup {
  if (concept.kind === "participle_er") return "er"
  return pick<VerbGroup>(["ir", "re"])
}

/** Day 9 / Day 17 — random regular verb → past participle (-ER → -é, -IR → -i, -RE → -u). */
export function generateParticipleQuestion(
  concept: ParticipleConcept
): Question {
  const config = VERB_GROUPS[groupFor(concept)]
  const infinitive = pick(config.verbs)
  const stem = config.stem(infinitive)
  const participle = `${stem}${config.participleEnding}`

  return {
    conceptId: concept.id,
    concept: concept.name,
    promptKey: "prompt.participle",
    promptParams: { phrase: infinitive },
    french: infinitive,
    answers: [participle],
    mode: "participle",
    infinitive,
    stem,
    participle,
  }
}
