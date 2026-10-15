import type { SourceRef } from "../domain/provenance"

export type ErPersonSlot = "1s" | "2s" | "3s" | "plural"

type ConceptBase = {
  id: string
  name: string
  explanation: string
  difficulty: number
  /**
   * Day 12: when false, the concept is kept (and trainable manually)
   * but excluded from the scheduler's mixed-session pool.
   */
  schedulable?: boolean
  /** Phase 2: owning chapter in the content taxonomy. */
  chapterId?: string
  /** Phase 2: provenance of this concept's pedagogical content. */
  source?: SourceRef
}

export type TranslateConcept = ConceptBase & {
  kind: "translate"
  examples: {
    french: string
    english: string[]
  }[]
}

export type ConjugateErConcept = ConceptBase & {
  kind: "conjugate_er"
  slot: ErPersonSlot
}

export type ConjugateIrConcept = ConceptBase & {
  kind: "conjugate_ir"
}

export type ConjugateReConcept = ConceptBase & {
  kind: "conjugate_re"
}

export type ConjugateRegularConcept = ConceptBase & {
  kind: "conjugate_regular"
}

export type IrregularVerb =
  | "etre"
  | "avoir"
  | "aller"
  | "faire"
  | "venir"
  | "prendre"
  | "pouvoir"
  | "vouloir"
  | "devoir"
  | "voir"
  | "dire"
  | "mettre"

export type ConjugateIrregularConcept = ConceptBase & {
  kind: "conjugate_irregular"
  verb: IrregularVerb
}

export type ParticipleErConcept = ConceptBase & {
  kind: "participle_er"
}

export type ParticipleIrReConcept = ConceptBase & {
  kind: "participle_ir_re"
}

export type PasseComposeAvoirConcept = ConceptBase & {
  kind: "pc_avoir"
}

export type PasseComposeNegationConcept = ConceptBase & {
  kind: "pc_negation"
}

export type EtreVerbSetConcept = ConceptBase & {
  kind: "pc_etre_set"
}

export type EtreAgreementConcept = ConceptBase & {
  kind: "pc_etre_agreement"
}

export type DetectionVariant = "pronoun" | "person" | "plural" | "gender"

export type DetectionConcept = ConceptBase & {
  kind: "detect"
  variant: DetectionVariant
}

export type AuxiliaryIntroConcept = ConceptBase & {
  kind: "auxiliary_intro"
}

export type FuturProcheConcept = ConceptBase & {
  kind: "futur_proche"
}

export type Concept =
  | TranslateConcept
  | ConjugateErConcept
  | ConjugateIrConcept
  | ConjugateReConcept
  | ConjugateRegularConcept
  | ConjugateIrregularConcept
  | ParticipleErConcept
  | ParticipleIrReConcept
  | PasseComposeAvoirConcept
  | PasseComposeNegationConcept
  | EtreVerbSetConcept
  | EtreAgreementConcept
  | DetectionConcept
  | AuxiliaryIntroConcept
  | FuturProcheConcept
