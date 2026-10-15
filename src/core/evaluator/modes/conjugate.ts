import type { EvaluationResult, EvalMeta } from "../types"

/** Day 6 — classify a present-tense conjugation error as ending vs stem. */
export function evaluateConjugate(
  normalizedUser: string,
  meta: EvalMeta
): EvaluationResult | null {
  if (
    meta.mode !== "conjugate" ||
    !meta.infinitive ||
    !meta.stem ||
    meta.expectedEnding === undefined
  ) {
    return null
  }

  const user = normalizedUser

  let userVerb = user
  if (meta.subject && user.startsWith(meta.subject)) {
    userVerb = user.slice(meta.subject.length).trim()
  } else {
    const parts = user.split(" ")
    if (parts.length === 2) {
      userVerb = parts[1]
    } else if (parts.length === 1) {
      userVerb = parts[0]
    }
  }

  const expectedStem = meta.stem
  if (userVerb.startsWith(expectedStem) && userVerb.length > expectedStem.length) {
    const userEnding = userVerb.slice(expectedStem.length)
    if (userEnding !== meta.expectedEnding) {
      return {
        correct: false,
        messageKey: "eval.wrongAnswer",
        errorType: "ending_error",
      }
    }
  }

  if (!userVerb.startsWith(expectedStem)) {
    return {
      correct: false,
      messageKey: "eval.wrongAnswer",
      errorType: "stem_error",
    }
  }

  return null
}
