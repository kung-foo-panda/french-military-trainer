/** Day 5 — regular -ER verbs (no orthographic stem changes). */
export const ER_VERBS = [
  "parler",
  "aimer",
  "regarder",
  "écouter",
  "travailler",
  "marcher",
  "demander",
  "trouver",
  "donner",
  "arriver",
] as const

export type ErVerb = (typeof ER_VERBS)[number]

export function erStem(infinitive: string): string {
  if (!infinitive.endsWith("er")) {
    throw new Error(`Not an -ER verb: ${infinitive}`)
  }
  return infinitive.slice(0, -2)
}
