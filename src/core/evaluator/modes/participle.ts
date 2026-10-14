import { normalize } from "../normalize"
import type { EvaluationResult, EvalMeta } from "../types"

/** Day 17 — past participle: classify by stem (answer shares the stem). */
export function evaluateParticiple(
  normalizedUser: string,
  meta: EvalMeta
): EvaluationResult | null {
  if (meta.mode !== "participle" || !meta.stem || !meta.participle) {
    return null
  }

  const user = normalizedUser
  const stem = normalize(meta.stem, meta.strict)
  if (user.startsWith(stem)) {
    return {
      correct: false,
      message: "Wrong past participle",
      errorType: "participle_error",
    }
  }

  return null
}
