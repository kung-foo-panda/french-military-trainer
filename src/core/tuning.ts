import { selectNextConceptState } from "./scheduler"
import { updateStrength } from "./strengthUpdate"
import { schedulableConceptIds } from "../grammar/concepts"
import { DEFAULT_STRENGTH } from "../types/conceptState"
import type { ConceptState } from "../types/conceptState"
import { mulberry32, simulateAnswer } from "./learnerModel"

const DAY_MS = 24 * 60 * 60 * 1000

export type TuningConfig = {
  wrongPenalty: number
  correctGain: number
  stabilityGrowth: number
  overdueWeight: number
}

/** Day 29 study result — the shipped configuration. */
export const DEFAULT_TUNING: TuningConfig = {
  wrongPenalty: 20,
  correctGain: 5,
  stabilityGrowth: 2,
  overdueWeight: 200,
}

export type TuningOutcome = {
  config: TuningConfig
  finalAccuracy: number
  meanStrength: number
  mastered: number
  backlog: number
  objective: number
}

function freshStates(): ConceptState[] {
  return schedulableConceptIds.map((id) => ({
    id,
    strength: DEFAULT_STRENGTH,
    stability: 1,
    failureCount: 0,
    lastReviewed: 0,
    nextReview: 0,
  }))
}

/** One simulated learner-day-run under a candidate config. */
function simulateOnce(
  config: TuningConfig,
  seed: number,
  days: number,
  perDay: number
): TuningOutcome {
  const rand = mulberry32(seed)
  const states = freshStates()
  let lastDayAccuracy = 0

  for (let d = 0; d < days; d++) {
    const now = d * DAY_MS
    let correctToday = 0
    for (let i = 0; i < perDay; i++) {
      const next = selectNextConceptState(states, now, config.overdueWeight)
      const idx = states.findIndex((s) => s.id === next.id)
      const { correct } = simulateAnswer(next.strength, 0, rand, next.stability)
      const { state: updated } = updateStrength(next, correct, now, {
        wrongPenalty: config.wrongPenalty,
        correctGain: config.correctGain,
        stabilityGrowth: config.stabilityGrowth,
      })
      states[idx] = updated
      if (correct) correctToday++
    }
    lastDayAccuracy = correctToday / perDay
  }

  const endNow = days * DAY_MS
  const meanStrength =
    states.reduce((sum, s) => sum + s.strength, 0) / states.length
  const mastered = states.filter((s) => s.strength > 85).length
  const backlog = states.filter((s) => s.nextReview <= endNow).length
  const objective =
    lastDayAccuracy + 0.5 * (mastered / states.length) - 0.02 * backlog

  return {
    config,
    finalAccuracy: lastDayAccuracy,
    meanStrength,
    mastered,
    backlog,
    objective,
  }
}

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8]

/** Average an outcome across several seeds to damp simulation noise. */
export function simulateTuning(
  config: TuningConfig,
  options?: { days?: number; perDay?: number; seeds?: number[] }
): TuningOutcome {
  const days = options?.days ?? 14
  const perDay = options?.perDay ?? 25
  const seeds = options?.seeds ?? SEEDS

  const runs = seeds.map((seed) => simulateOnce(config, seed, days, perDay))
  const n = runs.length
  const avg = (f: (r: TuningOutcome) => number) =>
    runs.reduce((sum, r) => sum + f(r), 0) / n

  return {
    config,
    finalAccuracy: avg((r) => r.finalAccuracy),
    meanStrength: avg((r) => r.meanStrength),
    mastered: avg((r) => r.mastered),
    backlog: avg((r) => r.backlog),
    objective: avg((r) => r.objective),
  }
}

/** Day 29 — sweep the candidate grid, best objective first. */
export function runTuningStudy(options?: {
  days?: number
  perDay?: number
  seeds?: number[]
}): TuningOutcome[] {
  const outcomes: TuningOutcome[] = []
  for (const wrongPenalty of [20, 25]) {
    for (const stabilityGrowth of [2, 1]) {
      for (const overdueWeight of [200, 100]) {
        outcomes.push(
          simulateTuning(
            { wrongPenalty, correctGain: 5, stabilityGrowth, overdueWeight },
            options
          )
        )
      }
    }
  }
  return outcomes.sort((a, b) => b.objective - a.objective)
}

export function bestConfig(outcomes: TuningOutcome[]): TuningConfig {
  return outcomes[0].config
}
