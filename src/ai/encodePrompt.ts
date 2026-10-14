export type ChapterInput = {
  number: number
  title: string
  text: string
}

/**
 * Day 24 — the AI grammar encoding prompt (roadmap lines 381–387):
 * extract atomic rules, dependencies, and verb irregularities as JSON.
 */
export const ENCODING_SYSTEM_PROMPT = [
  "You are a French grammar encoder for a spaced-repetition trainer.",
  "Extract:",
  "- Atomic rules (one trainable micro-skill each)",
  "- Dependencies (which concept ids a concept builds on)",
  "- Verb irregularities (forms, participles, auxiliary)",
  "Return ONLY structured JSON matching this shape:",
  "{",
  '  "chapter": number,',
  '  "title": string,',
  '  "atomicRules": string[],',
  '  "concepts": [{ "id": string, "name": string, "explanation": string,',
  '    "difficulty": number, "category": string, "trainable": boolean,',
  '    "examples": [{ "french": string, "english": string[] }],',
  '    "dependencies": string[], "irregular": boolean }],',
  '  "verbIrregularities": [{ "verb": string,',
  '    "group": "er" | "ir" | "re" | "irregular",',
  '    "forms": { "<person>": string }, "participle": string?,',
  '    "auxiliary": "avoir" | "etre"? }]',
  "}",
  "Keep ids lowercase snake_case. No prose, JSON only.",
].join("\n")

export function buildEncodingPrompt(chapter: ChapterInput): string {
  return [
    ENCODING_SYSTEM_PROMPT,
    "",
    `Chapter ${chapter.number}: ${chapter.title}`,
    "----",
    chapter.text,
  ].join("\n")
}
