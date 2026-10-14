import type { EvaluationResult, EvalMeta } from "../types"

/** Day 18 — auxiliary selection (être verb set): any miss is auxiliary_error. */
export function evaluateAuxiliary(
  _normalizedUser: string,
  meta: EvalMeta
): EvaluationResult | null {
  if (meta.mode !== "auxiliary" || !meta.auxiliary) {
    return null
  }

  return {
    correct: false,
    message: "Wrong auxiliary",
    errorType: "auxiliary_error",
  }
}
