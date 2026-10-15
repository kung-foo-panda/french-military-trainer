"use client"

import { type RefObject } from "react"
import { Button } from "./Button"

/**
 * The standard French diacritics, lowercase. Answers are case-insensitive in
 * the evaluator, so lowercase covers real typing needs. Kept as the full set
 * so every accented letter the content can require is reachable without a
 * French keyboard layout.
 */
export const FRENCH_SPECIAL_CHARS = [
  "à",
  "â",
  "æ",
  "ç",
  "é",
  "è",
  "ê",
  "ë",
  "î",
  "ï",
  "ô",
  "œ",
  "ù",
  "û",
  "ü",
  "ÿ",
] as const

/**
 * Pure insertion helper: splice `ch` into `value` between `start` and `end`
 * (replacing any selected range). Extracted so the caret math is unit-testable
 * without a DOM.
 */
export function insertAtCursor(
  value: string,
  ch: string,
  start: number,
  end: number
): string {
  return value.slice(0, start) + ch + value.slice(end)
}

/**
 * A compact row of buttons that insert French special characters into a
 * controlled input at the caret. Buttons are `type="button"` so they never
 * submit the surrounding form, and focus is returned to the input with the
 * caret advanced past the inserted character.
 */
export function SpecialCharBar({
  value,
  onChange,
  inputRef,
  label,
  chars = FRENCH_SPECIAL_CHARS,
}: {
  value: string
  onChange: (next: string) => void
  inputRef: RefObject<HTMLInputElement | null>
  label: string
  chars?: readonly string[]
}) {
  function insert(ch: string) {
    const el = inputRef.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? start
    onChange(insertAtCursor(value, ch, start, end))

    requestAnimationFrame(() => {
      const pos = start + ch.length
      el?.focus()
      el?.setSelectionRange(pos, pos)
    })
  }

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {chars.map((ch) => (
        <Button
          key={ch}
          type="button"
          variant="secondary"
          size="sm"
          aria-label={ch}
          onClick={() => insert(ch)}
          className="min-w-[2rem] px-2"
        >
          {ch}
        </Button>
      ))}
    </div>
  )
}
