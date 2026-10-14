"use client"

import { useEffect, useRef, useState } from "react"
import { planNextQuestion } from "../core/sessionEngine"
import { evaluateAnswer } from "../core/answerEvaluator"
import {
  explainPhrase,
  type PhraseExplanation,
} from "../core/grammarExplainer"
import { updateStrength } from "../core/strengthUpdate"
import { rankConceptStates } from "../core/scheduler"
import {
  createSessionState,
  type SessionState,
} from "../core/sessionState"
import {
  dateKey,
  recordCompletion,
  resolveDailyPlan,
} from "../core/dailyEnforcement"
import {
  loadEnforcementRecord,
  saveEnforcementRecord,
} from "../storage/enforcementStore"
import {
  loadDailyMetrics,
  saveDailyMetrics,
} from "../storage/dailyMetricsStore"
import {
  appendSession,
  computeStressReport,
  type SessionMetric,
} from "../core/dailyMetrics"
import {
  ensureConceptStates,
  loadConceptStates,
  saveConceptStates,
} from "../storage/progressStore"
import type { ConceptState } from "../types/conceptState"
import type { Question } from "../types/question"
import {
  concepts,
  schedulableConceptIds,
} from "../grammar/concepts"

type ConceptStat = { name: string; correct: number; total: number }

function bootstrap() {
  const today = dateKey(new Date())
  const enforcement = resolveDailyPlan(loadEnforcementRecord(), today)
  saveEnforcementRecord(enforcement)

  const states = ensureConceptStates(
    loadConceptStates(),
    schedulableConceptIds
  )
  const planned = planNextQuestion(states, 0, null)
  const remaining = Math.max(
    1,
    enforcement.targetToday - enforcement.completedToday
  )
  return {
    states,
    question: planned.question,
    weakness: planned.weakness,
    session: createSessionState(remaining),
    enforcement,
    metrics: loadDailyMetrics(today),
  }
}

export default function TrainerPage() {
  const [boot] = useState(bootstrap)
  const [states, setStates] = useState<ConceptState[]>(boot.states)
  const [session, setSession] = useState<SessionState>(boot.session)
  const [question, setQuestion] = useState<Question>(boot.question)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [explanation, setExplanation] = useState<
    PhraseExplanation[]
  >([])
  const [lastReinsert, setLastReinsert] = useState(false)
  const [weakness, setWeakness] = useState(boot.weakness)
  const [enforcement, setEnforcement] = useState(boot.enforcement)
  const [dailyMetrics, setDailyMetrics] = useState(boot.metrics)
  const [now] = useState(() => Date.now())
  const [conceptStats, setConceptStats] = useState<
    Record<string, ConceptStat>
  >({})
  const [sessionStartAt, setSessionStartAt] = useState(() => Date.now())
  const [liveNow, setLiveNow] = useState(() => Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const questionShownAtRef = useRef(0)

  useEffect(() => {
    if (session.finished) return
    const id = setInterval(() => setLiveNow(new Date().getTime()), 1000)
    return () => clearInterval(id)
  }, [session.finished])

  useEffect(() => {
    if (!session.finished) {
      inputRef.current?.focus()
    }
    questionShownAtRef.current = new Date().getTime()
  }, [question, session.finished])

  const concept =
    concepts.find((c) => c.id === question.conceptId) ?? null

  const ranking = rankConceptStates(states)

  const statEntries = Object.entries(conceptStats)
  const weakestToday = statEntries
    .map(([id, s]) => ({ id, ...s, accuracy: s.correct / s.total }))
    .filter((s) => s.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0]

  const elapsedSeconds = Math.max(
    0,
    Math.round((liveNow - sessionStartAt) / 1000)
  )

  const stressReport = computeStressReport(dailyMetrics)

  function startNewSession() {
    const today = dateKey(new Date())
    const plan = resolveDailyPlan(enforcement, today)
    saveEnforcementRecord(plan)

    const seeded = ensureConceptStates(
      states,
      schedulableConceptIds
    )
    const remaining = Math.max(1, plan.targetToday - plan.completedToday)
    const fresh = createSessionState(remaining)
    const planned = planNextQuestion(seeded, 0, null)
    const startedAt = new Date().getTime()
    setSessionStartAt(startedAt)
    setLiveNow(startedAt)
    setConceptStats({})
    setEnforcement(plan)
    setSession(fresh)
    setStates(seeded)
    setQuestion(planned.question)
    setWeakness(planned.weakness)
    setAnswer("")
    setFeedback("")
    setExplanation([])
    setLastReinsert(false)
  }

  function checkAnswer(provided?: string) {
    if (session.finished) return

    const submitted = provided ?? answer

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
    setFeedback(
      result.correct
        ? result.message
        : `${result.message} (${result.errorType}) (expected: ${question.answers[0]})`
    )

    const explainTarget =
      question.mode === "translate"
        ? question.french
        : question.answers[0]
    setExplanation(question.choices ? [] : explainPhrase(explainTarget))

    const idx = states.findIndex((s) => s.id === question.conceptId)
    const existing =
      idx >= 0
        ? states[idx]
        : ensureConceptStates([], [question.conceptId])[0]

    const { state: updatedState, reinsert } = updateStrength(
      existing,
      result.correct
    )
    setLastReinsert(reinsert)

    setConceptStats((prev) => {
      const cur = prev[question.conceptId] ?? {
        name: question.concept,
        correct: 0,
        total: 0,
      }
      return {
        ...prev,
        [question.conceptId]: {
          name: cur.name,
          correct: cur.correct + (result.correct ? 1 : 0),
          total: cur.total + 1,
        },
      }
    })

    const nextStates = [...states]
    if (idx >= 0) {
      nextStates[idx] = updatedState
    } else {
      nextStates.push(updatedState)
    }
    setStates(nextStates)
    saveConceptStates(nextStates)

    const today = dateKey(new Date())
    const { record: nextEnforcement } = recordCompletion(enforcement, today)
    setEnforcement(nextEnforcement)
    saveEnforcementRecord(nextEnforcement)

    const completed = session.completed + 1
    const finished = completed >= session.targetLength

    const elapsedMs = new Date().getTime() - questionShownAtRef.current
    const nextSession: SessionState = {
      correct: session.correct + (result.correct ? 1 : 0),
      incorrect: session.incorrect + (result.correct ? 0 : 1),
      streak: result.correct ? session.streak + 1 : 0,
      completed,
      targetLength: session.targetLength,
      finished,
      forceConceptId: reinsert ? question.conceptId : null,
      totalTimeMs: session.totalTimeMs + elapsedMs,
    }
    setSession(nextSession)

    if (finished) {
      const finalStats = { ...conceptStats }
      const prevStat = finalStats[question.conceptId] ?? {
        name: question.concept,
        correct: 0,
        total: 0,
      }
      finalStats[question.conceptId] = {
        name: prevStat.name,
        correct: prevStat.correct + (result.correct ? 1 : 0),
        total: prevStat.total + 1,
      }
      const metric: SessionMetric = {
        startedAt: sessionStartAt,
        durationMs: new Date().getTime() - sessionStartAt,
        correct: nextSession.correct,
        incorrect: nextSession.incorrect,
        totalTimeMs: nextSession.totalTimeMs,
        conceptStats: finalStats,
      }
      const nextMetrics = appendSession(dailyMetrics, metric)
      setDailyMetrics(nextMetrics)
      saveDailyMetrics(nextMetrics)

      setFeedback(
        `${result.correct ? result.message : `${result.message} (expected: ${question.answers[0]})`} — Session complete (${session.targetLength}/${session.targetLength}).`
      )
      return
    }

    const planned = planNextQuestion(
      nextStates,
      completed,
      nextSession.forceConceptId
    )
    setQuestion(planned.question)
    setWeakness(planned.weakness)
    setAnswer("")
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>French Military Trainer</h1>

      <p>
        Day streak: {enforcement.streakDays} — today{" "}
        {enforcement.completedToday}/{enforcement.targetToday}
        {enforcement.skipDebt ? " — SKIP DEBT (escalated to 40)" : ""}
      </p>

      <p>
        Session: {session.completed}/{session.targetLength} — {elapsedSeconds}s
        {session.completed > 0
          ? ` — avg ${(session.totalTimeMs / session.completed / 1000).toFixed(1)}s`
          : ""}
        {session.finished ? " — DONE" : ""}
        {lastReinsert ? " — REINSERT (strength < 40)" : ""}
        {weakness ? " — WEAKNESS HUNT (strength < 50)" : ""}
        {weakestToday
          ? ` — weakest today: ${weakestToday.name} (${(weakestToday.accuracy * 100).toFixed(0)}%)`
          : ""}
      </p>

      {stressReport.sessionCount > 0 && (
        <p>
          Today: {stressReport.sessionCount} session(s), {stressReport.answers}{" "}
          answers, {(stressReport.accuracy * 100).toFixed(0)}% acc, avg{" "}
          {(stressReport.avgAnswerMs / 1000).toFixed(1)}s
          {stressReport.sessionCount >= 2
            ? ` — decay ${(stressReport.degradation * 100).toFixed(0)}%, slowdown ${(
                stressReport.slowdownMs / 1000
              ).toFixed(1)}s`
            : ""}
          {stressReport.weakestConcept
            ? ` — weakest: ${stressReport.weakestConcept.name} (${(
                stressReport.weakestConcept.accuracy * 100
              ).toFixed(0)}%)`
            : ""}
        </p>
      )}

      {!session.finished && (
        <>
          <h2>{question.question}</h2>
          {question.mode === "translate" && <h3>{question.french}</h3>}
          {!question.choices && question.mode !== "translate" && (
            <h3>{`Infinitive: ${question.french}`}</h3>
          )}
          {concept && <p>{concept.name}</p>}

          {question.choices ? (
            <div>
              {question.choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => checkAnswer(choice)}
                  style={{ marginRight: 8 }}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                checkAnswer()
              }}
            >
              <input
                ref={inputRef}
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={
                  question.mode === "conjugate"
                    ? "e.g. je parle"
                    : question.mode === "participle"
                      ? "e.g. parlé"
                      : question.mode === "passe_compose" ||
                          question.mode === "mixed_tense"
                        ? "e.g. nous avons parlé"
                        : question.mode === "negation"
                          ? "e.g. nous n'avons pas parlé"
                          : question.mode === "etre_pc"
                            ? "e.g. elle est allée"
                            : question.mode === "futur_proche"
                              ? "e.g. je vais parler"
                              : "Your answer"
                }
              />

              <br />
              <br />

              <button type="submit">Submit</button>
            </form>
          )}
        </>
      )}

      {session.finished && (
        <div>
          <h3>Session report</h3>
          <p>
            Score: {session.correct}/{session.correct + session.incorrect} (
            {(
              (session.correct /
                Math.max(1, session.correct + session.incorrect)) *
              100
            ).toFixed(0)}
            %)
          </p>
          <p>
            Avg time:{" "}
            {(session.totalTimeMs / Math.max(1, session.completed) / 1000).toFixed(
              1
            )}
            s
          </p>
          <p>Duration: {elapsedSeconds}s</p>
          {weakestToday && (
            <p>
              Weakest concept today: {weakestToday.name} (
              {(weakestToday.accuracy * 100).toFixed(0)}% over{" "}
              {weakestToday.total})
            </p>
          )}
          <ul>
            {statEntries.map(([id, s]) => (
              <li key={id}>
                {s.name}: {s.correct}/{s.total} (
                {((s.correct / s.total) * 100).toFixed(0)}%)
              </li>
            ))}
          </ul>
          <button onClick={startNewSession}>Start new session</button>
        </div>
      )}

      <p>{feedback}</p>

      <div>
        {explanation.map((e, i) => (
          <div key={i}>
            {e.word} → {e.meaning}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Session</h3>
        <pre>{JSON.stringify(session, null, 2)}</pre>

        <h3>Scheduler ranking (overdue → weak → failures)</h3>
        <pre>
          {JSON.stringify(
            ranking.map((s) => {
              return {
                id: s.id,
                strength: s.strength,
                failureCount: s.failureCount,
                overdue: s.nextReview <= now,
              }
            }),
            null,
            2
          )}
        </pre>

        <h3>Concept states</h3>
        <pre>{JSON.stringify(states, null, 2)}</pre>
      </div>
    </main>
  )
}
