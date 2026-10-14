export type EncodedExample = { french: string; english: string[] }

export type EncodedConcept = {
  id: string
  name: string
  explanation: string
  difficulty: number
  category: string
  trainable: boolean
  examples: EncodedExample[]
  dependencies: string[]
  irregular: boolean
}

export type EncodedVerbIrregularity = {
  verb: string
  group: "er" | "ir" | "re" | "irregular"
  forms: Record<string, string>
  participle?: string
  auxiliary?: "avoir" | "etre"
}

export type EncodedChapter = {
  chapter: number
  title: string
  atomicRules: string[]
  concepts: EncodedConcept[]
  verbIrregularities: EncodedVerbIrregularity[]
}

export type ValidationResult =
  | { ok: true; chapter: EncodedChapter }
  | { ok: false; errors: string[] }

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string")
}

function isStringRecord(v: unknown): v is Record<string, string> {
  return (
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    Object.values(v).every((x) => typeof x === "string")
  )
}

/** Day 24 — hand-rolled validator for AI-produced chapter JSON (no Zod). */
export function validateEncodedChapter(value: unknown): ValidationResult {
  const errors: string[] = []

  if (typeof value !== "object" || value === null) {
    return { ok: false, errors: ["root is not an object"] }
  }

  const v = value as Record<string, unknown>
  if (typeof v.chapter !== "number") errors.push("chapter must be a number")
  if (typeof v.title !== "string") errors.push("title must be a string")
  if (!isStringArray(v.atomicRules)) errors.push("atomicRules must be string[]")

  if (!Array.isArray(v.concepts)) {
    errors.push("concepts must be an array")
  } else {
    v.concepts.forEach((c, i) => {
      if (typeof c !== "object" || c === null) {
        errors.push(`concepts[${i}] is not an object`)
        return
      }
      const cc = c as Record<string, unknown>
      if (typeof cc.id !== "string") errors.push(`concepts[${i}].id`)
      if (typeof cc.name !== "string") errors.push(`concepts[${i}].name`)
      if (typeof cc.explanation !== "string")
        errors.push(`concepts[${i}].explanation`)
      if (typeof cc.difficulty !== "number")
        errors.push(`concepts[${i}].difficulty`)
      if (!isStringArray(cc.dependencies))
        errors.push(`concepts[${i}].dependencies`)
      if (typeof cc.irregular !== "boolean")
        errors.push(`concepts[${i}].irregular`)
      if (!Array.isArray(cc.examples)) {
        errors.push(`concepts[${i}].examples`)
      } else {
        cc.examples.forEach((e, j) => {
          if (typeof e !== "object" || e === null) {
            errors.push(`concepts[${i}].examples[${j}]`)
            return
          }
          const ee = e as Record<string, unknown>
          if (typeof ee.french !== "string")
            errors.push(`concepts[${i}].examples[${j}].french`)
          if (!isStringArray(ee.english))
            errors.push(`concepts[${i}].examples[${j}].english`)
        })
      }
    })
  }

  if (!Array.isArray(v.verbIrregularities)) {
    errors.push("verbIrregularities must be an array")
  } else {
    v.verbIrregularities.forEach((r, i) => {
      if (typeof r !== "object" || r === null) {
        errors.push(`verbIrregularities[${i}] is not an object`)
        return
      }
      const rr = r as Record<string, unknown>
      if (typeof rr.verb !== "string") errors.push(`verbIrregularities[${i}].verb`)
      if (!["er", "ir", "re", "irregular"].includes(rr.group as string))
        errors.push(`verbIrregularities[${i}].group`)
      if (!isStringRecord(rr.forms))
        errors.push(`verbIrregularities[${i}].forms`)
    })
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, chapter: value as EncodedChapter }
}
