import { test } from "node:test"
import assert from "node:assert/strict"
import {
  OVERDUE_WEIGHT,
  conceptPriority,
  rankConceptStates,
  selectNextConceptState,
} from "../src/core/scheduler"
import type { ConceptState } from "../src/types/conceptState"

function state(partial: Partial<ConceptState> & { id: string }): ConceptState {
  return {
    strength: 50,
    stability: 1,
    failureCount: 0,
    lastReviewed: 0,
    nextReview: 0,
    ...partial,
  }
}

test("OVERDUE_WEIGHT is 200", () => {
  assert.equal(OVERDUE_WEIGHT, 200)
})

test("overdue adds the overdue weight", () => {
  const now = 1_000_000
  const overdue = state({ id: "a", nextReview: now - 1 })
  const notOverdue = state({ id: "b", nextReview: now + 1 })
  assert.equal(
    conceptPriority(overdue, now) - conceptPriority(notOverdue, now),
    OVERDUE_WEIGHT
  )
})

test("priority = overdue*weight + (100-strength) + min(fail,5)*2", () => {
  const now = 1_000_000
  const s = state({ id: "a", nextReview: now - 1, strength: 30, failureCount: 3 })
  assert.equal(conceptPriority(s, now), 200 + 70 + 6)
})

test("failure pressure is capped at 5", () => {
  const now = 1_000_000
  const s = state({ id: "a", nextReview: now + 1, failureCount: 99 })
  assert.equal(conceptPriority(s, now), 50 + 10)
})

test("overdue beats higher strength", () => {
  const now = 1_000_000
  const overdue = state({ id: "overdue", nextReview: now - 1, strength: 100 })
  const weak = state({ id: "weak", nextReview: now + 1, strength: 0, failureCount: 5 })
  assert.equal(selectNextConceptState([weak, overdue], now).id, "overdue")
})

test("ties fall back to array order", () => {
  const now = 1_000_000
  const a = state({ id: "a", nextReview: now + 1 })
  const b = state({ id: "b", nextReview: now + 1 })
  assert.equal(selectNextConceptState([a, b], now).id, "a")
  assert.equal(selectNextConceptState([b, a], now).id, "b")
})

test("selectNextConceptState throws on empty input", () => {
  assert.throws(() => selectNextConceptState([], 0))
})

test("rankConceptStates sorts highest priority first", () => {
  const now = 1_000_000
  const a = state({ id: "a", nextReview: now + 1, strength: 90 })
  const b = state({ id: "b", nextReview: now - 1, strength: 80 })
  const c = state({ id: "c", nextReview: now + 1, strength: 10 })
  assert.deepEqual(
    rankConceptStates([a, b, c], now).map((s) => s.id),
    ["b", "c", "a"]
  )
})
