import { AVOIR_FORMS, type AuxForm } from "../grammar/auxVerbs"
import { VERB_GROUPS } from "../grammar/verbGroups"
import type { Concept } from "../types/concept"
import type { Question } from "../types/question"

type RegularKind = "conjugate_er" | "conjugate_ir" | "conjugate_re"

const GROUP_BY_KIND: Record<RegularKind, "er" | "ir" | "re"> = {
  conjugate_er: "er",
  conjugate_ir: "ir",
  conjugate_re: "re",
}

function avoirFor(subject: string): AuxForm {
  return AVOIR_FORMS.find((f) => f.subject === subject) ?? AVOIR_FORMS[0]
}

function isRegularKind(kind: Concept["kind"]): kind is RegularKind {
  return (
    kind === "conjugate_er" ||
    kind === "conjugate_ir" ||
    kind === "conjugate_re"
  )
}

/**
 * Day 23 — escalation ladder for mastered concepts:
 * - present regular conjugation → mixed-tense prompt (give passé composé too)
 * - passé composé → add negation automatically
 * Other modes are returned unchanged.
 */
export function escalateQuestion(
  question: Question,
  concept: Concept
): Question {
  if (
    question.mode === "conjugate" &&
    isRegularKind(concept.kind) &&
    question.subject &&
    question.stem
  ) {
    const participle = `${question.stem}${
      VERB_GROUPS[GROUP_BY_KIND[concept.kind]].participleEnding
    }`
    const aux = avoirFor(question.subject)
    return {
      ...question,
      mode: "mixed_tense",
      promptKey: "prompt.mixedTense",
      promptParams: { subject: question.subject, phrase: question.infinitive ?? "" },
      answers: [`${aux.form} ${participle}`],
      auxiliary: aux.form,
      participle,
    }
  }

  if (
    question.mode === "passe_compose" &&
    question.subject &&
    question.participle
  ) {
    const aux = avoirFor(question.subject)
    return {
      ...question,
      mode: "negation",
      promptKey: "prompt.toNegation",
      promptParams: { subject: question.subject, phrase: question.infinitive ?? "" },
      answers: [`${question.subject} n'${aux.verb} pas ${question.participle}`],
      auxiliary: aux.form,
    }
  }

  return question
}
