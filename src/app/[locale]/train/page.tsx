"use client"

import { useEffect, useRef, useState } from "react"
import { planNextQuestion } from "@/core/sessionEngine"
import { type TrainingPlan } from "@/core/trainingPlan"
import { evaluateAnswer } from "@/core/answerEvaluator"
import { explainPhrase, type PhraseExplanation } from "@/core/grammarExplainer"
import { updateStrength } from "@/core/strengthUpdate"
import { createSessionState, type SessionState } from "@/core/sessionState"
import {
  dateKey,
  recordCompletion,
  resolveDailyPlan,
} from "@/core/dailyEnforcement"
import {
  loadEnforcementRecord,
  saveEnforcementRecord,
} from "@/storage/enforcementStore"
import {
  loadDailyMetrics,
  saveDailyMetrics,
} from "@/storage/dailyMetricsStore"
import {
  appendSession,
  computeStressReport,
  type SessionMetric,
} from "@/core/dailyMetrics"
import {
  loadConceptStates,
  mergeConceptStates,
  saveConceptStates,
} from "@/storage/progressStore"
import {
  loadTrainingPlan,
  saveTrainingPlan,
} from "@/storage/trainingPlanStore"
import { concepts, schedulableConceptIds } from "@/grammar/concepts"
import {
  createInitialConceptState,
  type ConceptState,
} from "@/types/conceptState"
import type { Question } from "@/types/question"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Stat } from "@/components/ui/Stat"
import { TrainingPlanPicker } from "@/components/TrainingPlanPicker"
import { useT } from "@/i18n/LocaleProvider"
import type { MessageKey } from "@/i18n"

type ConceptStat = { name: string; correct: number; total: number }

function bootstrap() {
  const today = dateKey(new Date())
  const enforcement = resolveDailyPlan(loadEnforcementRecord(), today)
  saveEnforcementRecord(enforcement)

  const states = mergeConceptStates(
    loadConceptStates(),
    schedulableConceptIds
  )
  const plan = loadTrainingPlan()
  const planned = planNextQuestion(states, 0, null, plan)
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
    plan,
  }
}

const PLACEHOLDER_KEYS: Partial<Record<Question["mode"], MessageKey>> = {
  conjugate: "placeholder.conjugate",
  participle: "placeholder.participle",
  passe_compose: "placeholder.passe_compose",
  mixed_tense: "placeholder.mixed_tense",
  negation: "placeholder.negation",
  etre_pc: "placeholder.etre_pc",
  futur_proche: "placeholder.futur_proche",
}

export default function TrainPage() {
  const [boot] = useState(bootstrap)
  const [states, setStates] = useState<ConceptState[]>(boot.states)
  const [session, setSession] = useState<SessionState>(boot.session)
  const [question, setQuestion] = useState<Question>(boot.question)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [explanation, setExplanation] = useState<PhraseExplanation[]>([])
  const [lastReinsert, setLastReinsert] = useState(false)
  const [weakness, setWeakness] = useState(boot.weakness)
  const [enforcement, setEnforcement] = useState(boot.enforcement)
  const [dailyMetrics, setDailyMetrics] = useState(boot.metrics)
  const [plan, setPlan] = useState<TrainingPlan>(boot.plan)
  const [conceptStats, setConceptStats] = useState<
    Record<string, ConceptStat>
  >({})
  const [sessionStartAt, setSessionStartAt] = useState(() => Date.now())
  const [liveNow, setLiveNow] = useState(() => Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const questionShownAtRef = useRef(0)
  const t = useT()

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

  const concept = concepts.find((c) => c.id === question.conceptId) ?? null
  const placeholderKey = PLACEHOLDER_KEYS[question.mode]

  const statEntries = Object.entries(conceptStats)
  const weakestToday = statEntries
    .map(([id, s]) => ({ id, ...s, accuracy: s.correct / s.total }))
    .filter((s) => s.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0]

  const elapsedSeconds = Math.max(
    0,
    Math.round((liveNow - sessionStartAt) / 1000)
  )

  const accuracyPct = Math.round(
    (session.correct / Math.max(1, session.correct + session.incorrect)) * 100
  )

  const stressReport = computeStressReport(dailyMetrics)

  function startNewSession(activePlan: TrainingPlan = plan) {
    const today = dateKey(new Date())
    const planRecord = resolveDailyPlan(enforcement, today)
    saveEnforcementRecord(planRecord)

    const seeded = mergeConceptStates(states, schedulableConceptIds)
    const remaining = Math.max(1, planRecord.targetToday - planRecord.completedToday)
    const fresh = createSessionState(remaining)
    const planned = planNextQuestion(seeded, 0, null, activePlan)
    const startedAt = new Date().getTime()
    setSessionStartAt(startedAt)
    setLiveNow(startedAt)
    setConceptStats({})
    setEnforcement(planRecord)
    setSession(fresh)
    setStates(seeded)
    setQuestion(planned.question)
    setWeakness(planned.weakness)
    setAnswer("")
    setFeedback("")
    setLastCorrect(null)
    setExplanation([])
    setLastReinsert(false)
  }

  function changePlan(next: TrainingPlan) {
    setPlan(next)
    saveTrainingPlan(next)
    startNewSession(next)
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
    setLastCorrect(result.correct)
    setFeedback(
      result.correct
        ? t(result.messageKey)
        : t("train.feedback.expected", {
            message: t(result.messageKey),
            answer: question.answers[0],
          })
    )

    const explainTarget =
      question.mode === "translate" ? question.french : question.answers[0]
    setExplanation(
      question.choices ? [] : explainPhrase(explainTarget, t)
    )

    const idx = states.findIndex((s) => s.id === question.conceptId)
    const existing =
      idx >= 0 ? states[idx] : createInitialConceptState(question.conceptId)

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
      return
    }

    const planned = planNextQuestion(
      nextStates,
      completed,
      nextSession.forceConceptId,
      plan
    )
    setQuestion(planned.question)
    setWeakness(planned.weakness)
    setAnswer("")
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("train.heading")}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{t("train.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">
            {t("train.streak", { days: enforcement.streakDays })}
          </Badge>
          {enforcement.skipDebt && (
            <Badge tone="warn">{t("train.targetRaised")}</Badge>
          )}
          {weakness && !session.finished && (
            <Badge tone="neutral">{t("train.weaknessFocus")}</Badge>
          )}
          {lastReinsert && !session.finished && (
            <Badge tone="neutral">{t("train.reinforced")}</Badge>
          )}
        </div>
      </header>

      <Card>
        <TrainingPlanPicker plan={plan} onChange={changePlan} />
      </Card>

      <Card>
        <ProgressBar
          value={enforcement.completedToday}
          max={enforcement.targetToday}
          label={t("train.todayPlan")}
        />
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label={t("train.stat.session")}
          value={`${session.completed}/${session.targetLength}`}
        />
        <Stat label={t("train.stat.elapsed")} value={`${elapsedSeconds}s`} />
        <Stat
          label={t("train.stat.avg")}
          value={
            session.completed > 0
              ? `${(session.totalTimeMs / session.completed / 1000).toFixed(1)}s`
              : "—"
          }
        />
      </div>

      {stressReport.sessionCount > 0 && (
        <p className="text-xs text-ink-faint">
          {t("train.stress.summary", {
            sessions: stressReport.sessionCount,
            answers: stressReport.answers,
            acc: (stressReport.accuracy * 100).toFixed(0),
            avg: (stressReport.avgAnswerMs / 1000).toFixed(1),
          })}
          {stressReport.sessionCount >= 2
            ? t("train.stress.decay", {
                pct: (stressReport.degradation * 100).toFixed(0),
                slow: (stressReport.slowdownMs / 1000).toFixed(1),
              })
            : ""}
          {stressReport.weakestConcept
            ? t("train.stress.weakest", {
                name: stressReport.weakestConcept.name,
                pct: (stressReport.weakestConcept.accuracy * 100).toFixed(0),
              })
            : ""}
        </p>
      )}

      {!session.finished && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              {concept ? concept.name : t("train.practice")}
            </span>
            {question.mode === "detect" && (
              <Badge tone="neutral">{t("train.recognition")}</Badge>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-ink">
              {t(question.promptKey, question.promptParams)}
            </h2>
            {question.mode === "translate" ? (
              <p className="text-lg text-ink-soft">{question.french}</p>
            ) : !question.choices ? (
              <p className="text-sm text-ink-soft">
                {t("train.infinitive")}{" "}
                <span className="font-medium text-ink">
                  {question.french}
                </span>
              </p>
            ) : null}
          </div>

          {question.choices ? (
            <div className="flex flex-wrap gap-2">
              {question.choices.map((choice) => (
                <Button
                  key={choice}
                  variant="secondary"
                  onClick={() => checkAnswer(choice)}
                >
                  {choice}
                </Button>
              ))}
            </div>
          ) : (
            <form
              className="flex flex-wrap items-center gap-3"
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
                  placeholderKey ? t(placeholderKey) : t("placeholder.default")
                }
                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
              <Button type="submit">{t("train.submit")}</Button>
            </form>
          )}

          {feedback && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                lastCorrect === false
                  ? "bg-danger-soft text-danger"
                  : lastCorrect
                    ? "bg-success-soft text-success"
                    : "text-ink-soft"
              }`}
            >
              {feedback}
            </p>
          )}

          {explanation.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {explanation.map((item, i) => (
                <span
                  key={i}
                  className="rounded-md bg-surface-2 px-2 py-1 text-xs text-ink-soft"
                >
                  {item.word} → {item.meaning}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}

      {session.finished && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{t("train.report.title")}</h2>
            <Badge tone="success">{t("train.report.complete")}</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label={t("train.report.score")}
              value={`${session.correct}/${session.correct + session.incorrect}`}
              hint={t("train.report.correctPct", { pct: accuracyPct })}
            />
            <Stat
              label={t("train.report.avg")}
              value={`${(
                session.totalTimeMs /
                Math.max(1, session.completed) /
                1000
              ).toFixed(1)}s`}
            />
            <Stat
              label={t("train.report.duration")}
              value={`${elapsedSeconds}s`}
            />
          </div>

          {weakestToday && (
            <p className="text-sm text-ink-soft">
              {t("train.report.weakestToday", {
                name: weakestToday.name,
                pct: (weakestToday.accuracy * 100).toFixed(0),
                total: weakestToday.total,
              })}
            </p>
          )}

          <div>
            <h3 className="mb-2 text-sm font-medium text-ink-soft">
              {t("train.report.byConcept")}
            </h3>
            <ul className="divide-y divide-border">
              {statEntries.map(([id, s]) => (
                <li
                  key={id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-ink">{s.name}</span>
                  <span className="text-ink-soft">
                    {s.correct}/{s.total} (
                    {((s.correct / s.total) * 100).toFixed(0)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {feedback && (
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-ink-soft">
              {feedback}
            </p>
          )}

          <Button onClick={() => startNewSession()}>
            {t("train.report.startNew")}
          </Button>
        </Card>
      )}
    </div>
  )
}
