import { normalize } from "../normalize"
import type { EvaluationResult, EvalMeta } from "../types"

/** Day 10 / Day 23 — passé composé and its mixed-tense escalation: check auxiliary + participle. */
export function evaluatePasseCompose(
  normalizedUser: string,
  meta: EvalMeta
): EvaluationResult | null {
  if (
    (meta.mode !== "passe_compose" && meta.mode !== "mixed_tense") ||
    !meta.auxiliary ||
    !meta.participle
  ) {
    return null
  }

  const user = normalizedUser
  const aux = normalize(meta.auxiliary, meta.strict)
  const participle = normalize(meta.participle, meta.strict)

  const auxiliaryOk = user.startsWith(aux)
  const participleOk = user.endsWith(participle)

  if (auxiliaryOk && participleOk) {
    return { correct: true, messageKey: "eval.correct", errorType: "correct" }
  }
  if (!auxiliaryOk && participleOk) {
    return {
      correct: false,
      messageKey: "eval.wrongAuxiliary",
      errorType: "auxiliary_error",
    }
  }
  if (auxiliaryOk && !participleOk) {
    return {
      correct: false,
      messageKey: "eval.wrongParticiple",
      errorType: "participle_error",
    }
  }

  return null
}
