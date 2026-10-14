export type Gender = "masculine" | "feminine"
export type GrammaticalNumber = "singular" | "plural"
export type PersonIndex = "1s" | "2s" | "3s" | "1p" | "2p" | "3p"

export type Pronoun =
  | "je"
  | "tu"
  | "il"
  | "elle"
  | "nous"
  | "vous"
  | "ils"
  | "elles"

/** Day 15 (C1–C4) — noun subjects tagged with pronoun, gender, number. */
export type NounSubject = {
  label: string
  pronoun: Pronoun
  gender: Gender
  number: GrammaticalNumber
}

export const NOUN_SUBJECTS: NounSubject[] = [
  { label: "Marie", pronoun: "elle", gender: "feminine", number: "singular" },
  { label: "Paul", pronoun: "il", gender: "masculine", number: "singular" },
  { label: "la femme", pronoun: "elle", gender: "feminine", number: "singular" },
  { label: "l'homme", pronoun: "il", gender: "masculine", number: "singular" },
  { label: "le garçon", pronoun: "il", gender: "masculine", number: "singular" },
  { label: "la fille", pronoun: "elle", gender: "feminine", number: "singular" },
  { label: "le professeur", pronoun: "il", gender: "masculine", number: "singular" },
  { label: "la voiture", pronoun: "elle", gender: "feminine", number: "singular" },
  { label: "Pierre et moi", pronoun: "nous", gender: "masculine", number: "plural" },
  { label: "Marie et toi", pronoun: "vous", gender: "feminine", number: "plural" },
  { label: "Paul et Marie", pronoun: "ils", gender: "masculine", number: "plural" },
  { label: "Marie et Anne", pronoun: "elles", gender: "feminine", number: "plural" },
  { label: "les enfants", pronoun: "ils", gender: "masculine", number: "plural" },
  { label: "mes amies", pronoun: "elles", gender: "feminine", number: "plural" },
]

export const PRONOUN_CHOICES: Pronoun[] = [
  "je",
  "tu",
  "il",
  "elle",
  "nous",
  "vous",
  "ils",
  "elles",
]

export const PERSON_INDEX: Record<Pronoun, PersonIndex> = {
  je: "1s",
  tu: "2s",
  il: "3s",
  elle: "3s",
  nous: "1p",
  vous: "2p",
  ils: "3p",
  elles: "3p",
}

export const PERSON_CHOICES: PersonIndex[] = [
  "1s",
  "2s",
  "3s",
  "1p",
  "2p",
  "3p",
]

export const NUMBER_CHOICES: GrammaticalNumber[] = ["singular", "plural"]
export const GENDER_CHOICES: Gender[] = ["masculine", "feminine"]
