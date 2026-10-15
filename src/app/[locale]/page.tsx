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
import { useLocale, useT } from "@/i18n/LocaleProvider"
import { localePath } from "@/i18n"

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
  const locale = useLocale()
  const t = useT()

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge tone="accent">{t("dashboard.badge")}</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("dashboard.heading")}
        </h1>
        <p className="max-w-2xl text-sm text-ink-soft">
          {t("dashboard.intro")}
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={localePath(locale, "/train")}
            className={buttonClass("primary")}
          >
            {t("dashboard.startTraining")}
          </Link>
          <Link
            href={localePath(locale, "/progress")}
            className={buttonClass("secondary")}
          >
            {t("dashboard.viewProgress")}
          </Link>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat
          label={t("dashboard.stat.today")}
          value={`${enforcement.completedToday}/${enforcement.targetToday}`}
          hint={t("dashboard.stat.todayHint")}
        />
        <Stat
          label={t("dashboard.stat.streak")}
          value={`${enforcement.streakDays}${t("unit.dayShort")}`}
        />
        <Stat label={t("dashboard.stat.dueToday")} value={summary.dueToday} />
        <Stat
          label={t("dashboard.stat.weak")}
          value={summary.weak}
          hint={t("dashboard.stat.weakHint", {
            pct: summary.avgStrength.toFixed(0),
          })}
        />
      </div>

      <Card className="space-y-3">
        <ProgressBar
          value={enforcement.completedToday}
          max={enforcement.targetToday}
          label={t("dashboard.todayPlan")}
        />
        {enforcement.skipDebt && (
          <p className="text-xs text-warn">{t("dashboard.skipDebt")}</p>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-medium">{t("dashboard.weakest")}</h2>
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
            <p className="text-sm text-ink-soft">{t("dashboard.noWeak")}</p>
          )}
          <Link
            href={localePath(locale, "/progress")}
            className="inline-block text-sm font-medium text-accent-strong"
          >
            {t("dashboard.seeBreakdown")}
          </Link>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-medium">{t("dashboard.accuracy7")}</h2>
          {series.length > 0 ? (
            <BarChart
              points={series.map((p) => ({
                label: p.date.slice(5),
                value: p.accuracy,
                hint: t("dashboard.correctHint", {
                  correct: p.correct,
                  answers: p.answers,
                }),
              }))}
              max={1}
              formatValue={(v) => `${(v * 100).toFixed(0)}%`}
              emptyLabel={t("chart.noData")}
            />
          ) : (
            <p className="text-sm text-ink-soft">
              {t("dashboard.accuracyEmpty")}
            </p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <h2 className="font-medium">{t("dashboard.trainTitle")}</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {t("dashboard.trainBody")}
          </p>
        </Card>
        <Card>
          <h2 className="font-medium">{t("dashboard.libraryTitle")}</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {t("dashboard.libraryBody")}
          </p>
        </Card>
        <Card>
          <h2 className="font-medium">{t("dashboard.progressTitle")}</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {t("dashboard.progressBody")}
          </p>
        </Card>
      </div>
    </div>
  )
}
