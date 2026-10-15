import { test } from "node:test"
import assert from "node:assert/strict"
import {
  FRENCH_SPECIAL_CHARS,
  insertAtCursor,
} from "../src/components/ui/SpecialCharBar"

test("FRENCH_SPECIAL_CHARS is the full lowercase French diacritic set", () => {
  assert.deepEqual(
    [...FRENCH_SPECIAL_CHARS],
    ["à", "â", "æ", "ç", "é", "è", "ê", "ë", "î", "ï", "ô", "œ", "ù", "û", "ü", "ÿ"]
  )
})

test("insertAtCursor inserts into an empty value", () => {
  assert.equal(insertAtCursor("", "é", 0, 0), "é")
})

test("insertAtCursor inserts at the start", () => {
  assert.equal(insertAtCursor("parle", "é", 0, 0), "éparle")
})

test("insertAtCursor inserts at the end", () => {
  assert.equal(insertAtCursor("parl", "é", 4, 4), "parlé")
})

test("insertAtCursor inserts in the middle at the caret", () => {
  // "parler" with caret at index 2 → "pa" + "ê" + "rler"
  assert.equal(insertAtCursor("parler", "ê", 2, 2), "paêrler")
})

test("insertAtCursor replaces the selected range", () => {
  // "parler" with "er" (indices 4..6) selected → replaced by "é"
  assert.equal(insertAtCursor("parler", "é", 4, 6), "parlé")
})

test("insertAtCursor splices at the caret when there is no selection", () => {
  // "déjà" with caret at index 2 → "dé" + "è" + "jà"
  assert.equal(insertAtCursor("déjà", "è", 2, 2), "déèjà")
})
