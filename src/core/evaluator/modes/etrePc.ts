import { normalize } from "../normalize"
import type { EvaluationResult, EvalMeta } from "../types"

/** Day 19 — être passé composé with singular agreement. */
export function evaluateEtrePc(
  normalizedUser: string,
  meta: EvalMeta
): EvaluationResult | null {
  if (meta.mode !== "etre_pc" || !meta.auxiliary || !meta.participle) {
    return null
  }

  const user = normalizedUser
  const aux = normalize(meta.auxiliary, meta.strict)
  const participle = normalize(meta.participle, meta.strict)
  const agreement = meta.agreement ?? ""
  const otherTail = `${participle}${agreement === "e" ? "" : "e"}`
  const tail = user.split(/\s+/).pop() ?? ""

  if (!user.includes(aux)) {
    return {
      correct: false,
      messageKey: "eval.wrongAuxiliary",
      errorType: "auxiliary_error",
    }
  }
  if (tail === otherTail) {
    return {
      correct: false,
      messageKey: "eval.agreementError",
      errorType: "agreement_error",
    }
  }
  return {
    correct: false,
    messageKey: "eval.wrongParticiple",
    errorType: "participle_error",
  }
}
