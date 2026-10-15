import { normalize } from "../normalize"
import type { EvaluationResult, EvalMeta } from "../types"

/**
 * Day 26 / Phase 4 — futur proche = aller (present) + infinitive. The prompt
 * hands the learner the infinitive, so a miss that still contains it isolates
 * the error to the aller form → auxiliary_error; other misses fall through.
 */
export function evaluateFuturProche(
  normalizedUser: string,
  meta: EvalMeta
): EvaluationResult | null {
  if (meta.mode !== "futur_proche" || !meta.auxiliary || !meta.infinitive) {
    return null
  }

  const infinitive = normalize(meta.infinitive, meta.strict)
  if (infinitive.length === 0) return null

  const containsInfinitive =
    normalizedUser.endsWith(infinitive) ||
    normalizedUser.split(" ").includes(infinitive)

  if (!containsInfinitive) {
    return null
  }

  return {
    correct: false,
    messageKey: "eval.wrongAller",
    errorType: "auxiliary_error",
  }
}
