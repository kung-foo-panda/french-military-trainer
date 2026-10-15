"use client"

import { useState } from "react"
import Link from "next/link"
import { concepts, schedulableConceptIds } from "@/grammar/concepts"
import { loadConceptStates, mergeConceptStates } from "@/storage/progressStore"
import { loadEnforcementRecord } from "@/storage/enforcementStore"
import { loadMetricsHistory } from "@/storage/dailyMetricsStore"
import { dateKey, resolveDailyPlan } from "@/core/dailyEnforcement"
import {
  historySeries,
  summarizeMastery,
  weakConcepts,
} from "@/core/progressSummary"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { buttonClass } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Stat } from "@/components/ui/Stat"
import { BarChart } from "@/components/ui/BarChart"

const CONCEPT_BY_ID = new Map(concepts.map((c) => [c.id, c]))

function build() {
  const states = mergeConceptStates(loadConceptStates(), schedulableConceptIds)
  const enforcement = resolveDailyPlan(
    loadEnforcementRecord(),
    dateKey(new Date())
  )
  const history = loadMetricsHistory()
  const now = new Date().getTime()
  return {
    enforcement,
    series: historySeries(history, 7),
    summary: summarizeMastery(states, now),
    weak: weakConcepts(states).slice(0, 3),
  }
}

export default function DashboardPage() {
  const [view] = useState(build)
  const { enforcement, series, summary, weak } = view

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge tone="accent">Spaced-repetition trainer</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Bonjour. Ready to train?
        </h1>
        <p className="max-w-2xl text-sm text-ink-soft">
          Each session blends due reviews, your weakest concepts, and new
          material. Answer carefully — wrong or slow items come back sooner.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/train" className={buttonClass("primary")}>
            Start training
          </Link>
          <Link href="/progress" className={buttonClass("secondary")}>
            View progress
          </Link>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat
          label="Today"
          value={`${enforcement.completedToday}/${enforcement.targetToday}`}
          hint="Exercises completed"
        />
        <Stat label="Streak" value={`${enforcement.streakDays}d`} />
        <Stat label="Due today" value={summary.dueToday} />
        <Stat
          label="Weak"
          value={summary.weak}
          hint={`Avg strength ${summary.avgStrength.toFixed(0)}%`}
        />
      </div>

      <Card className="space-y-3">
        <ProgressBar
          value={enforcement.completedToday}
          max={enforcement.targetToday}
          label="Today’s plan"
        />
        {enforcement.skipDebt && (
          <p className="text-xs text-warn">
            Yesterday was missed — today’s target is raised to 40.
          </p>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-medium">Where you’re weakest</h2>
          {weak.length > 0 ? (
            <ul className="space-y-3">
              {weak.map((state) => (
                <li key={state.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-ink">
                      {CONCEPT_BY_ID.get(state.id)?.name ?? state.id}
                    </span>
                    <span className="text-ink-soft">
                      {state.strength.toFixed(0)}%
                    </span>
                  </div>
                  <ProgressBar value={state.strength} max={100} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-soft">
              No weak spots right now — keep the streak going.
            </p>
          )}
          <Link
            href="/progress"
            className="inline-block text-sm font-medium text-accent-strong"
          >
            See full breakdown →
          </Link>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-medium">Accuracy — last 7 days</h2>
          {series.length > 0 ? (
            <BarChart
              points={series.map((p) => ({
                label: p.date.slice(5),
                value: p.accuracy,
                hint: `${p.correct}/${p.answers} correct`,
              }))}
              max={1}
              formatValue={(v) => `${(v * 100).toFixed(0)}%`}
            />
          ) : (
            <p className="text-sm text-ink-soft">
              Finish a session to start tracking your accuracy.
            </p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <h2 className="font-medium">Train</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Mixed drills tuned to your current strengths and gaps.
          </p>
        </Card>
        <Card>
          <h2 className="font-medium">Library</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Every concept with a plain-language explanation.
          </p>
        </Card>
        <Card>
          <h2 className="font-medium">Progress</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Mastery, weak spots, and your practice history.
          </p>
        </Card>
      </div>
    </div>
  )
}
