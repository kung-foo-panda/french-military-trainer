export type QuestionMode =
  | "translate"
  | "conjugate"
  | "participle"
  | "passe_compose"
  | "negation"
  | "detect"
  | "auxiliary"
  | "etre_pc"
  | "mixed_tense"
  | "futur_proche"

export type Question = {
  conceptId: string
  concept: string
  question: string
  /** Shown cue: French phrase (translate) or infinitive (conjugate) */
  french: string
  answers: string[]
  mode: QuestionMode
  /** Day 15: clickable choices for detection drills */
  choices?: string[]
  /** Day 6: classification metadata for conjugate drills */
  subject?: string
  infinitive?: string
  stem?: string
  expectedEnding?: string
  /** Day 10: passé composé classification metadata */
  auxiliary?: string
  participle?: string
  /** Day 19: être agreement suffix ("" masculine, "e" feminine) */
  agreement?: string
}
