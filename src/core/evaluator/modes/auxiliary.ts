import type { EvaluationResult, EvalMeta } from "../types"

/**
 * Recognized auxiliary surface forms (être / avoir, all persons). A miss that
 * names a real auxiliary is an auxiliary_error; anything else falls through so
 * an unrelated answer is reported as a plain wrong_answer.
 */
const AUXILIARY_FORMS = new Set([
  "etre",
  "être",
  "suis",
  "es",
  "est",
  "sommes",
  "etes",
  "êtes",
  "sont",
  "avoir",
  "ai",
  "as",
  "a",
  "avons",
  "avez",
  "ont",
])

/**
 * Day 18 — auxiliary selection (être verb set). The correct answer is caught
 * upstream by the exact match; here we only classify a miss as an
 * auxiliary confusion when the learner actually named an auxiliary.
 */
export function evaluateAuxiliary(
  normalizedUser: string,
  meta: EvalMeta
): EvaluationResult | null {
  if (meta.mode !== "auxiliary" || !meta.auxiliary) {
    return null
  }

  const tokens = normalizedUser.split(" ").filter(Boolean)
  const last = tokens[tokens.length - 1] ?? ""

  if (!AUXILIARY_FORMS.has(normalizedUser) && !AUXILIARY_FORMS.has(last)) {
    return null
  }

  return {
    correct: false,
    message: "Wrong auxiliary",
    errorType: "auxiliary_error",
  }
}
