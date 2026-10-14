import { normalize } from "../normalize"
import type { EvaluationResult, EvalMeta } from "../types"

/** Day 11 — negative passé composé: strict ne + auxiliary + pas + participle. */
export function evaluateNegation(
  normalizedUser: string,
  meta: EvalMeta
): EvaluationResult | null {
  if (meta.mode !== "negation" || !meta.auxiliary || !meta.participle) {
    return null
  }

  const user = normalizedUser
  const aux = normalize(meta.auxiliary, meta.strict)
  const subject = meta.subject ? normalize(meta.subject, meta.strict) : ""

  // Strip the subject, then any elision ("j'ai" → "ai", "n'ai" → "ai") so the
  // bare verb is matched even when "je" elides to "j'".
  let verb = subject && aux.startsWith(subject) ? aux.slice(subject.length) : aux
  verb = verb.replace(/^[a-zà-ÿ]+['’]/, "").trim() || verb.trim()

  const participle = normalize(meta.participle, meta.strict)

  const auxiliaryOk = verb.length > 0 && user.includes(verb)
  const participleOk = user.endsWith(participle)
  const neOk = /(?:^|\s)n['’]/.test(user) || /(?:^|\s)ne\s/.test(user)
  const pasOk = /(?:^|\s)pas(?:\s|$)/.test(user)

  if (auxiliaryOk && participleOk && neOk && pasOk) {
    return { correct: true, message: "Correct!", errorType: "correct" }
  }
  if (!participleOk) {
    return {
      correct: false,
      message: "Wrong past participle",
      errorType: "participle_error",
    }
  }
  if (!auxiliaryOk) {
    return {
      correct: false,
      message: "Wrong auxiliary",
      errorType: "auxiliary_error",
    }
  }
  return {
    correct: false,
    message: "Negation missing (ne … pas)",
    errorType: "negation_error",
  }
}
