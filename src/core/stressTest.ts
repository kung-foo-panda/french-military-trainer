import { planNextQuestion } from "./sessionEngine"
import { evaluateAnswer } from "./answerEvaluator"
import { updateStrength } from "./strengthUpdate"
import { schedulableConceptIds } from "../grammar/concepts"
import { createInitialConceptState, SESSION_LENGTH } from "../types/conceptState"
import type { ConceptState } from "../types/conceptState"
import {
  appendSession,
  computeStressReport,
  emptyDailyMetrics,
  STRESS_SESSIONS,
  type DailyMetrics,
  type SessionMetric,
  type StressReport,
} from "./dailyMetrics"
import { mulberry32, simulateAnswer } from "./learnerModel"

function incorrectFor(answer: string): string {
  const trimmed = answer.trimEnd()
  return trimmed.length > 1 ? trimmed.slice(0, -1) : `${answer}x`
}

export type StressRun = {
  report: StressReport
  metrics: DailyMetrics
  states: ConceptState[]
}

/**
 * Day 28 — harness: run 3 back-to-back 25-question sessions through the real
 * engine against a simulated learner and return the cognitive-load report.
 * Also drives the Day 29 tuning loop.
 */
export function runStressTest(options?: {
  date?: string
  seed?: number
  sessions?: number
}): StressRun {
  const date = options?.date ?? "1970-01-01"
  const seed = options?.seed ?? 12345
  const sessionCount = options?.sessions ?? STRESS_SESSIONS
  const rand = mulberry32(seed)

  let states: ConceptState[] = schedulableConceptIds.map(
    createInitialConceptState
  )
  let metrics = emptyDailyMetrics(date)

  for (let s = 0; s < sessionCount; s++) {
    let session: SessionMetric = {
      startedAt: s,
      durationMs: 0,
      correct: 0,
      incorrect: 0,
      totalTimeMs: 0,
      conceptStats: {},
    }

    let forceConceptId: string | null = null
    for (let i = 0; i < SESSION_LENGTH; i++) {
      const { question } = planNextQuestion(states, i, forceConceptId)
      const idx = states.findIndex((st) => st.id === question.conceptId)
      const existing =
        idx >= 0 ? states[idx] : createInitialConceptState(question.conceptId)

      const { correct, ms } = simulateAnswer(existing.strength, s, rand)
      const submitted = correct
        ? question.answers[0]
        : incorrectFor(question.answers[0])

      const result = evaluateAnswer(submitted, question.answers, {
        mode: question.mode,
        strict: true,
        infinitive: question.infinitive,
        subject: question.subject,
        stem: question.stem,
        expectedEnding: question.expectedEnding,
        auxiliary: question.auxiliary,
        participle: question.participle,
        agreement: question.agreement,
      })

      const actuallyCorrect = result.correct
      const { state: updated, reinsert } = updateStrength(existing, actuallyCorrect)
      const next = [...states]
      if (idx >= 0) next[idx] = updated
      else next.push(updated)
      states = next
      forceConceptId = reinsert ? question.conceptId : null

      const cs = session.conceptStats[question.conceptId] ?? {
        name: question.concept,
        correct: 0,
        total: 0,
      }
      cs.correct += actuallyCorrect ? 1 : 0
      cs.total += 1
      session = {
        ...session,
        correct: session.correct + (actuallyCorrect ? 1 : 0),
        incorrect: session.incorrect + (actuallyCorrect ? 0 : 1),
        totalTimeMs: session.totalTimeMs + ms,
        durationMs: session.durationMs + ms,
        conceptStats: { ...session.conceptStats, [question.conceptId]: cs },
      }
    }

    metrics = appendSession(metrics, session)
  }

  return { report: computeStressReport(metrics), metrics, states }
}
