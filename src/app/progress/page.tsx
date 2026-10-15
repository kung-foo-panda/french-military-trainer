"use client"

import { useState } from "react"
import Link from "next/link"
import { concepts, schedulableConceptIds } from "@/grammar/concepts"
import { chapters } from "@/content/chapters"
import { loadConceptStates, mergeConceptStates } from "@/storage/progressStore"
import { loadEnforcementRecord } from "@/storage/enforcementStore"
import { loadMetricsHistory } from "@/storage/dailyMetricsStore"
import { dateKey, resolveDailyPlan } from "@/core/dailyEnforcement"
import {
  bandDistribution,
  dueConcepts,
  historySeries,
  masteryBand,
  masteryLabel,
  summarizeMastery,
  weakConcepts,
  weakestFirst,
  type MasteryBand,
} from "@/core/progressSummary"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { buttonClass } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Stat } from "@/components/ui/Stat"
import { BarChart } from "@/components/ui/BarChart"

const CONCEPT_BY_ID = new Map(concepts.map((c) => [c.id, c]))
const CHAPTER_BY_ID = new Map(chapters.map((c) => [c.id, c]))

const BAND_TONE: Record<MasteryBand, "neutral" | "accent" | "success" | "warn"> = {
  new: "neutral",
  fragile: "warn",
  developing: "neutral",
  solid: "accent",
  mastered: "success",
}

function shortDate(date: string): string {
  return date.slice(5)
}

function build() {
  const states = mergeConceptStates(loadConceptStates(), schedulableConceptIds)
  const enforcement = resolveDailyPlan(
    loadEnforcementRecord(),
    dateKey(new Date())
  )
  const history = loadMetricsHistory()
  const now = new Date().getTime()
  return {
    states,
    enforcement,
    series: historySeries(history, 14),
    summary: summarizeMastery(states, now),
    bands: bandDistribution(states),
    due: dueConcepts(states, now),
    weak: weakConcepts(states),
    ranked: weakestFirst(states),
  }
}

export default function ProgressPage() {
  const [view] = useState(build)
  const { enforcement, series, summary, bands, due, weak, ranked } = view
  const hasPractice = series.length > 0

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Mastery across the training pool, plus your practice history.
          </p>
        </div>
        <Link href="/train" className={buttonClass("primary")}>
          Train now
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat
          label="Mastered"
          value={`${summary.mastered}/${summary.total}`}
          hint="High strength, stable recall"
        />
        <Stat
          label="Weak"
          value={summary.weak}
          hint="Below the review threshold"
        />
        <Stat label="Due today" value={summary.dueToday} hint="Scheduled reviews" />
        <Stat
          label="Avg strength"
          value={`${summary.avgStrength.toFixed(0)}%`}
          hint={`Streak ${enforcement.streakDays} day(s)`}
        />
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium">Today’s plan</h2>
          {enforcement.skipDebt && <Badge tone="warn">Raised to 40</Badge>}
        </div>
        <ProgressBar
          value={enforcement.completedToday}
          max={enforcement.targetToday}
          label="Completed"
        />
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium">Mastery distribution</h2>
          <span className="text-xs text-ink-faint">
            {summary.total} concepts
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {bands.map((band) => (
            <span
              key={band.band}
              className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs text-ink-soft"
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
              {band.label}
              <span className="font-semibold text-ink">{band.count}</span>
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-medium">Accuracy — last 14 days</h2>
          {hasPractice ? (
            <BarChart
              points={series.map((p) => ({
                label: shortDate(p.date),
                value: p.accuracy,
                hint: `${p.correct}/${p.answers} correct`,
              }))}
              max={1}
              formatValue={(v) => `${(v * 100).toFixed(0)}%`}
            />
          ) : (
            <p className="text-sm text-ink-soft">
              No sessions recorded yet — your accuracy trend appears after your
              first session.
            </p>
          )}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-medium">Avg time per answer (s)</h2>
          {hasPractice ? (
            <BarChart
              points={series.map((p) => ({
                label: shortDate(p.date),
                value: p.avgAnswerMs / 1000,
              }))}
              formatValue={(v) => `${v.toFixed(1)}s`}
            />
          ) : (
            <p className="text-sm text-ink-soft">
              Answer timing appears once you have practiced.
            </p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-medium">Weak concepts</h2>
            <Badge tone={weak.length > 0 ? "warn" : "success"}>
              {weak.length}
            </Badge>
          </div>
          {weak.length > 0 ? (
            <ul className="space-y-3">
              {weak.slice(0, 6).map((state) => {
                const concept = CONCEPT_BY_ID.get(state.id)
                return (
                  <li key={state.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-ink">
                        {concept?.name ?? state.id}
                      </span>
                      <span className="text-ink-soft">
                        {state.strength.toFixed(0)}%
                      </span>
                    </div>
                    <ProgressBar value={state.strength} max={100} />
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-ink-soft">
              Nothing below the threshold — nice work.
            </p>
          )}
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-medium">Due for review</h2>
            <Badge tone={due.length > 0 ? "accent" : "success"}>
              {due.length}
            </Badge>
          </div>
          {due.length > 0 ? (
            <ul className="divide-y divide-border text-sm">
              {due.slice(0, 8).map((state) => {
                const concept = CONCEPT_BY_ID.get(state.id)
                return (
                  <li
                    key={state.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-ink">
                      {concept?.name ?? state.id}
                    </span>
                    <span className="text-ink-soft">
                      {state.strength.toFixed(0)}%
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-ink-soft">
              Everything is scheduled for later.
            </p>
          )}
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="font-medium">By concept</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-faint">
                <th className="py-2 pr-3 font-medium">Concept</th>
                <th className="py-2 pr-3 font-medium">Chapter</th>
                <th className="py-2 pr-3 font-medium">Level</th>
                <th className="py-2 pr-3 font-medium">Strength</th>
                <th className="py-2 pr-3 font-medium">Stability</th>
                <th className="py-2 font-medium">Failures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranked.map((state) => {
                const concept = CONCEPT_BY_ID.get(state.id)
                const chapter = concept?.chapterId
                  ? CHAPTER_BY_ID.get(concept.chapterId)
                  : undefined
                return (
                  <tr key={state.id}>
                    <td className="py-2 pr-3 text-ink">
                      {concept?.name ?? state.id}
                    </td>
                    <td className="py-2 pr-3 text-ink-soft">
                      {chapter?.title ?? "—"}
                    </td>
                    <td className="py-2 pr-3">
                      <Badge tone={BAND_TONE[masteryBand(state.strength)]}>
                        {masteryLabel(state.strength)}
                      </Badge>
                    </td>
                    <td className="py-2 pr-3 text-ink-soft">
                      {state.strength.toFixed(0)}%
                    </td>
                    <td className="py-2 pr-3 text-ink-soft">
                      {state.stability}
                    </td>
                    <td className="py-2 text-ink-soft">{state.failureCount}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
