import { buildEncodingPrompt, type ChapterInput } from "./encodePrompt"
import {
  validateEncodedChapter,
  type EncodedChapter,
} from "./encodedConcept"

/**
 * Day 24 — no LLM key is configured, so the pipeline returns a ready-to-paste
 * prompt. Paste it into the model, then feed the JSON to parseEncodedChapter.
 */
export function encodeGrammarFromPDF(chapter: ChapterInput): string {
  return buildEncodingPrompt(chapter)
}

/** Validate AI-produced JSON into an EncodedChapter, throwing on malformed input. */
export function parseEncodedChapter(json: string): EncodedChapter {
  const parsed: unknown = JSON.parse(json)
  const result = validateEncodedChapter(parsed)
  if (!result.ok) {
    throw new Error(`Invalid encoded chapter: ${result.errors.join("; ")}`)
  }
  return result.chapter
}
