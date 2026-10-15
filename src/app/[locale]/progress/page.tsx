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
  masteryLabelKey,
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
import { useLocale, useT } from "@/i18n/LocaleProvider"
import { localePath } from "@/i18n"

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
  const locale = useLocale()
  const t = useT()

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("progress.heading")}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {t("progress.subtitle")}
          </p>
        </div>
        <Link
          href={localePath(locale, "/train")}
          className={buttonClass("primary")}
        >
          {t("progress.trainNow")}
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat
          label={t("progress.stat.mastered")}
          value={`${summary.mastered}/${summary.total}`}
          hint={t("progress.stat.masteredHint")}
        />
        <Stat
          label={t("progress.stat.weak")}
          value={summary.weak}
          hint={t("progress.stat.weakHint")}
        />
        <Stat
          label={t("progress.stat.dueToday")}
          value={summary.dueToday}
          hint={t("progress.stat.dueTodayHint")}
        />
        <Stat
          label={t("progress.stat.avgStrength")}
          value={`${summary.avgStrength.toFixed(0)}%`}
          hint={t("progress.stat.avgStrengthHint", {
            days: enforcement.streakDays,
          })}
        />
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium">{t("progress.todayPlan")}</h2>
          {enforcement.skipDebt && (
            <Badge tone="warn">{t("progress.raised")}</Badge>
          )}
        </div>
        <ProgressBar
          value={enforcement.completedToday}
          max={enforcement.targetToday}
          label={t("progress.completed")}
        />
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium">{t("progress.masteryDistribution")}</h2>
          <span className="text-xs text-ink-faint">
            {t("progress.conceptsCount", { count: summary.total })}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {bands.map((band) => (
            <span
              key={band.band}
              className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs text-ink-soft"
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
              {t(band.labelKey)}
              <span className="font-semibold text-ink">{band.count}</span>
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-medium">{t("progress.accuracy14")}</h2>
          {hasPractice ? (
            <BarChart
              points={series.map((p) => ({
                label: shortDate(p.date),
                value: p.accuracy,
                hint: t("progress.correctHint", {
                  correct: p.correct,
                  answers: p.answers,
                }),
              }))}
              max={1}
              formatValue={(v) => `${(v * 100).toFixed(0)}%`}
              emptyLabel={t("chart.noData")}
            />
          ) : (
            <p className="text-sm text-ink-soft">{t("progress.noSessions")}</p>
          )}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-medium">{t("progress.avgTime")}</h2>
          {hasPractice ? (
            <BarChart
              points={series.map((p) => ({
                label: shortDate(p.date),
                value: p.avgAnswerMs / 1000,
              }))}
              formatValue={(v) => `${v.toFixed(1)}s`}
              emptyLabel={t("chart.noData")}
            />
          ) : (
            <p className="text-sm text-ink-soft">{t("progress.noTiming")}</p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-medium">{t("progress.weakConcepts")}</h2>
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
            <p className="text-sm text-ink-soft">{t("progress.nothingWeak")}</p>
          )}
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-medium">{t("progress.dueForReview")}</h2>
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
              {t("progress.everythingScheduled")}
            </p>
          )}
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="font-medium">{t("progress.byConcept")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-faint">
                <th className="py-2 pr-3 font-medium">
                  {t("progress.table.concept")}
                </th>
                <th className="py-2 pr-3 font-medium">
                  {t("progress.table.chapter")}
                </th>
                <th className="py-2 pr-3 font-medium">
                  {t("progress.table.level")}
                </th>
                <th className="py-2 pr-3 font-medium">
                  {t("progress.table.strength")}
                </th>
                <th className="py-2 pr-3 font-medium">
                  {t("progress.table.stability")}
                </th>
                <th className="py-2 font-medium">
                  {t("progress.table.failures")}
                </th>
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
                        {t(masteryLabelKey(state.strength))}
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
