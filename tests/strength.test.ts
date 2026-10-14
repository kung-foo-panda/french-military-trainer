import { test } from "node:test"
import assert from "node:assert/strict"
import {
  CORRECT_STRENGTH_GAIN,
  STABILITY_GROWTH,
  WRONG_STRENGTH_PENALTY,
  updateStrength,
} from "../src/core/strengthUpdate"
import {
  BASE_INTERVAL_DAYS,
  createInitialConceptState,
} from "../src/types/conceptState"

const DAY = 24 * 60 * 60 * 1000

test("tunables are the Day 29 values", () => {
  assert.equal(CORRECT_STRENGTH_GAIN, 5)
  assert.equal(WRONG_STRENGTH_PENALTY, 20)
  assert.equal(STABILITY_GROWTH, 2)
})

test("correct answer raises strength and stability", () => {
  const now = 5_000
  const input = createInitialConceptState("x")
  const { state, reinsert } = updateStrength(input, true, now)
  assert.equal(state.strength, 55)
  assert.equal(state.stability, 3)
  assert.equal(state.failureCount, 0)
  assert.equal(state.lastReviewed, now)
  assert.equal(reinsert, false)
  assert.equal(state.nextReview, now + BASE_INTERVAL_DAYS * 3 * DAY)
})

test("wrong answer drops strength, resets stability, increments failures", () => {
  const now = 5_000
  const input = { ...createInitialConceptState("x"), stability: 5, failureCount: 1 }
  const { state, reinsert } = updateStrength(input, false, now)
  assert.equal(state.strength, 30)
  assert.equal(state.stability, 1)
  assert.equal(state.failureCount, 2)
  assert.equal(reinsert, true)
})

test("strength is clamped to 100", () => {
  const input = { ...createInitialConceptState("x"), strength: 98 }
  assert.equal(updateStrength(input, true, 0).state.strength, 100)
})

test("strength is clamped to 0", () => {
  const input = { ...createInitialConceptState("x"), strength: 10 }
  assert.equal(updateStrength(input, false, 0).state.strength, 0)
})

test("no reinsert when wrong but still at the threshold", () => {
  const input = { ...createInitialConceptState("x"), strength: 60 }
  const { state, reinsert } = updateStrength(input, false, 0)
  assert.equal(state.strength, 40)
  assert.equal(reinsert, false)
})

test("reinsert triggers below the threshold", () => {
  const input = { ...createInitialConceptState("x"), strength: 55 }
  const { state, reinsert } = updateStrength(input, false, 0)
  assert.equal(state.strength, 35)
  assert.equal(reinsert, true)
})

test("more than two failures pins the interval to 1 day", () => {
  const now = 1_000
  const input = { ...createInitialConceptState("x"), failureCount: 3 }
  assert.equal(updateStrength(input, true, now).state.nextReview, now + DAY)
})

test("custom params override the tunables", () => {
  const input = createInitialConceptState("x")
  const { state } = updateStrength(input, true, 0, {
    correctGain: 10,
    stabilityGrowth: 0,
  })
  assert.equal(state.strength, 60)
  assert.equal(state.stability, 1)
})
