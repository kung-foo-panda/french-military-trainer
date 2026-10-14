/**
 * Day 22 — strict mode requires exact accents and exact spacing (no trimming
 * or whitespace collapsing); still case-insensitive. The default (lenient)
 * path is unchanged from Day 20.
 */
export function normalize(text: string, strict = false): string {
  const folded = text.replace(/[’‘]/g, "'")
  if (strict) {
    return folded.toLowerCase()
  }
  return folded.trim().toLowerCase().replace(/\s+/g, " ")
}
