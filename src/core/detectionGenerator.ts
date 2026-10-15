import {
  GENDER_CHOICES,
  NOUN_SUBJECTS,
  NUMBER_CHOICES,
  PERSON_CHOICES,
  PERSON_INDEX,
  PRONOUN_CHOICES,
  type Pronoun,
} from "../grammar/subjects"
import { pick } from "./random"
import type { DetectionConcept } from "../types/concept"
import type { Question } from "../types/question"

/**
 * Day 15 — C1–C4 recognition drills.
 * Each variant yields a prompt, a cue, the accepted answers, and a set of
 * clickable choices rendered as buttons in the UI.
 */
export function generateDetectionQuestion(concept: DetectionConcept): Question {
  let promptKey: Question["promptKey"]
  let promptParams: Question["promptParams"]
  let cue: string
  let answers: string[]
  let choices: string[]

  switch (concept.variant) {
    case "pronoun": {
      const subject = pick(NOUN_SUBJECTS)
      promptKey = "prompt.replacePronoun"
      promptParams = { phrase: subject.label }
      cue = subject.label
      answers = [subject.pronoun]
      choices = [...PRONOUN_CHOICES]
      break
    }
    case "person": {
      const pronouns = Object.keys(PERSON_INDEX) as Pronoun[]
      const pronoun = pick(pronouns)
      promptKey = "prompt.personSlot"
      promptParams = { phrase: pronoun }
      cue = pronoun
      answers = [PERSON_INDEX[pronoun]]
      choices = [...PERSON_CHOICES]
      break
    }
    case "plural": {
      const subject = pick(NOUN_SUBJECTS)
      promptKey = "prompt.singularOrPlural"
      promptParams = { phrase: subject.label }
      cue = subject.label
      answers = [subject.number]
      choices = [...NUMBER_CHOICES]
      break
    }
    case "gender": {
      const singular = NOUN_SUBJECTS.filter((s) => s.number === "singular")
      const subject = pick(singular)
      promptKey = "prompt.gender"
      promptParams = { phrase: subject.label }
      cue = subject.label
      answers = [subject.gender]
      choices = [...GENDER_CHOICES]
      break
    }
  }

  return {
    conceptId: concept.id,
    concept: concept.name,
    promptKey,
    promptParams,
    french: cue,
    answers,
    mode: "detect",
    choices,
  }
}
