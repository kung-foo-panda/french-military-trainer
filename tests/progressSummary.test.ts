import { test } from "node:test"
import assert from "node:assert/strict"
import {
  bandDistribution,
  dueConcepts,
  historySeries,
  masteryBand,
  masteryLabel,
  summarizeMastery,
  weakConcepts,
  weakestFirst,
} from "../src/core/progressSummary"
import {
  createInitialConceptState,
  type ConceptState,
} from "../src/types/conceptState"
import type { DailyMetrics } from "../src/core/dailyMetrics"

function state(id: string, over: Partial<ConceptState> = {}): ConceptState {
  return { ...createInitialConceptState(id), ...over }
}

function session(
  startedAt: number,
  correct: number,
  incorrect: number,
  totalTimeMs = 0
) {
  return {
    startedAt,
    durationMs: 0,
    correct,
    incorrect,
    totalTimeMs,
    conceptStats: {},
  }
}

function day(date: string, sessions: ReturnType<typeof session>[]): DailyMetrics {
  return { date, sessions }
}

const NOW = 1000

test("summarizeMastery counts mastered, weak, due, and mean strength", () => {
  const states = [
    state("a", { strength: 95, stability: 5, failureCount: 0, nextReview: 0 }),
    state("b", { strength: 20, stability: 1, failureCount: 3, nextReview: 1e15 }),
    state("c", { strength: 60, stability: 2, failureCount: 0, nextReview: 0 }),
  ]
  const summary = summarizeMastery(states, NOW)
  assert.equal(summary.total, 3)
  assert.equal(summary.mastered, 1)
  assert.equal(summary.weak, 1)
  assert.equal(summary.dueToday, 2)
  assert.ok(Math.abs(summary.avgStrength - 175 / 3) < 1e-9)
})

test("dueConcepts lists only due items, weakest first", () => {
  const states = [
    state("a", { strength: 95, nextReview: 0 }),
    state("b", { strength: 30, nextReview: 1e15 }),
    state("c", { strength: 60, nextReview: 0 }),
  ]
  assert.deepEqual(dueConcepts(states, NOW).map((s) => s.id), ["c", "a"])
})

test("weakConcepts filters below the threshold", () => {
  const states = [
    state("a", { strength: 50 }),
    state("b", { strength: 49 }),
    state("c", { strength: 10 }),
  ]
  assert.deepEqual(weakConcepts(states).map((s) => s.id), ["c", "b"])
})

test("weakestFirst sorts ascending by strength", () => {
  const states = [
    state("a", { strength: 80 }),
    state("b", { strength: 10 }),
    state("c", { strength: 40 }),
  ]
  assert.deepEqual(weakestFirst(states).map((s) => s.id), ["b", "c", "a"])
})

test("mastery bands hit their documented boundaries", () => {
  assert.equal(masteryBand(0), "new")
  assert.equal(masteryBand(24), "new")
  assert.equal(masteryBand(25), "fragile")
  assert.equal(masteryBand(49), "fragile")
  assert.equal(masteryBand(50), "developing")
  assert.equal(masteryBand(74), "developing")
  assert.equal(masteryBand(75), "solid")
  assert.equal(masteryBand(89), "solid")
  assert.equal(masteryBand(90), "mastered")
  assert.equal(masteryLabel(100), "Mastered")
})

test("bandDistribution skips empty bands and keeps best-first order", () => {
  const states = [state("a", { strength: 95 }), state("c", { strength: 60 })]
  const bands = bandDistribution(states)
  assert.deepEqual(
    bands.map((b) => [b.band, b.count]),
    [
      ["mastered", 1],
      ["developing", 1],
    ]
  )
})

test("historySeries aggregates practiced days oldest-first and skips empty days", () => {
  const series = historySeries([
    day("2026-01-02", [session(1, 3, 1, 4000)]),
    day("2026-01-01", []),
    day("2026-01-03", [session(2, 1, 0, 6000)]),
  ])

  assert.deepEqual(series.map((p) => p.date), ["2026-01-02", "2026-01-03"])
  assert.equal(series[0].answers, 4)
  assert.equal(series[0].accuracy, 0.75)
  assert.equal(series[0].avgAnswerMs, 1000)
  assert.equal(series[1].accuracy, 1)
  assert.equal(series[1].avgAnswerMs, 6000)
})

test("historySeries keeps only the last N days", () => {
  const series = historySeries(
    [
      day("2026-01-01", [session(1, 1, 0)]),
      day("2026-01-02", [session(2, 1, 0)]),
      day("2026-01-03", [session(3, 1, 0)]),
    ],
    2
  )
  assert.deepEqual(series.map((p) => p.date), ["2026-01-02", "2026-01-03"])
})
