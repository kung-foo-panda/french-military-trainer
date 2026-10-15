import type { MessageKey, Translate } from "../i18n"

export type PhraseExplanation = {
  word: string
  meaning: string
}

const GLOSS_KEYS: Record<string, MessageKey> = {
  je: "gloss.je",
  suis: "gloss.suis",
  tu: "gloss.tu",
  es: "gloss.es",
  nous: "gloss.nous",
  sommes: "gloss.sommes",
  "j'ai": "gloss.j'ai",
  as: "gloss.as",
  a: "gloss.a",
  avons: "gloss.avons",
  avez: "gloss.avez",
  ont: "gloss.ont",
  il: "gloss.il",
  elle: "gloss.elle",
  ils: "gloss.ils",
  elles: "gloss.elles",
  vous: "gloss.vous",
  est: "gloss.est",
  sont: "gloss.sont",
  "êtes": "gloss.êtes",
}

/**
 * Word-by-word gloss under a submitted answer. The meaning comes from the
 * caller's `t()`, so the gloss follows the active UI locale.
 */
export function explainPhrase(
  french: string,
  t: Translate
): PhraseExplanation[] {
  const words = french.split(" ")

  return words.map((w) => ({
    word: w,
    meaning: t(GLOSS_KEYS[w] ?? "gloss.unknown"),
  }))
}
