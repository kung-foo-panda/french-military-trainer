import type { MessageKey } from "../../i18n"
import type { Question } from "../../types/question"

export type ErrorType =
  | "correct"
  | "ending_error"
  | "stem_error"
  | "auxiliary_error"
  | "participle_error"
  | "negation_error"
  | "agreement_error"
  | "wrong_answer"

export type EvaluationResult = {
  correct: boolean
  /** Catalogue key; the UI renders it with `t()` so feedback is locale-bound. */
  messageKey: MessageKey
  errorType: ErrorType
}

export type EvalMeta = {
  mode?: Question["mode"]
  /** Day 22 — exact accents + exact spacing (no trim/collapse). */
  strict?: boolean
  infinitive?: string
  subject?: string
  stem?: string
  expectedEnding?: string
  auxiliary?: string
  participle?: string
  agreement?: string
}

/**
 * A mode-specific classifier. Receives the already-normalized user answer and
 * the question metadata; returns a result when it applies, or null to fall
 * through to the next classifier.
 */
export type ModeEvaluator = (
  normalizedUser: string,
  meta: EvalMeta
) => EvaluationResult | null
