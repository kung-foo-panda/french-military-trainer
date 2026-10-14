import { normalize } from "./normalize"
import { evaluateConjugate } from "./modes/conjugate"
import { evaluatePasseCompose } from "./modes/passeCompose"
import { evaluateNegation } from "./modes/negation"
import { evaluateEtrePc } from "./modes/etrePc"
import { evaluateAuxiliary } from "./modes/auxiliary"
import { evaluateParticiple } from "./modes/participle"
import type { EvaluationResult, EvalMeta, ModeEvaluator } from "./types"

export type { ErrorType, EvaluationResult, EvalMeta } from "./types"

/** Order preserves the pre-refactor branch order exactly. */
const MODE_EVALUATORS: ModeEvaluator[] = [
  evaluateConjugate,
  evaluatePasseCompose,
  evaluateNegation,
  evaluateEtrePc,
  evaluateAuxiliary,
  evaluateParticiple,
]

/**
 * Accepts exact phrase match (translate or full conjugation).
 * Day 5: also accepts the conjugated verb alone if the full answer
 * is "subject + verb" (e.g. "parle" for "je parle").
 */
export function evaluateAnswer(
  userAnswer: string,
  correctAnswers: string[],
  meta: EvalMeta = {}
): EvaluationResult {
  const normalizedUser = normalize(userAnswer, meta.strict)
  const normalizedCorrect = correctAnswers.map((c) => normalize(c, meta.strict))

  if (normalizedCorrect.includes(normalizedUser)) {
    return { correct: true, message: "Correct!", errorType: "correct" }
  }

  for (const correct of normalizedCorrect) {
    const parts = correct.split(" ")
    if (parts.length >= 2) {
      const verbOnly = parts.slice(1).join(" ")
      if (normalizedUser === verbOnly) {
        return { correct: true, message: "Correct!", errorType: "correct" }
      }
    }
  }

  for (const evaluate of MODE_EVALUATORS) {
    const result = evaluate(normalizedUser, meta)
    if (result) {
      return result
    }
  }

  return { correct: false, message: "Not correct", errorType: "wrong_answer" }
}
