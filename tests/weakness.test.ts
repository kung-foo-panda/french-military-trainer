import { test } from "node:test"
import assert from "node:assert/strict"
import {
  WEAKNESS_SHARE,
  WEAKNESS_THRESHOLD,
  isWeaknessSlot,
  weakestConceptId,
} from "../src/core/weakness"
import { createInitialConceptState, type ConceptState } from "../src/types/conceptState"

function state(id: string, strength: number, failureCount = 0): ConceptState {
  return { ...createInitialConceptState(id), strength, failureCount }
}

test("thresholds match the design constants", () => {
  assert.equal(WEAKNESS_THRESHOLD, 50)
  assert.equal(WEAKNESS_SHARE, 0.4)
})

test("returns the single weakest schedulable concept below threshold", () => {
  const states = [state("present_er_1s", 45), state("present_er_2s", 10)]
  assert.equal(weakestConceptId(states), "present_er_2s")
})

test("ignores non-schedulable concepts", () => {
  const states = [state("etre_1s", 0), state("present_er_1s", 45)]
  assert.equal(weakestConceptId(states), "present_er_1s")
})

test("returns null when nothing is below the threshold", () => {
  assert.equal(weakestConceptId([state("present_er_1s", 50)]), null)
})

test("ties break on highest failure count", () => {
  const states = [state("present_er_1s", 20, 1), state("present_er_2s", 20, 4)]
  assert.equal(weakestConceptId(states), "present_er_2s")
})

test("weakness slots are 2 of every 5", () => {
  const slots = Array.from({ length: 10 }, (_, i) => isWeaknessSlot(i))
  assert.deepEqual(slots, [
    true,
    true,
    false,
    false,
    false,
    true,
    true,
    false,
    false,
    false,
  ])
})
