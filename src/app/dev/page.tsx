"use client"

import { useState } from "react"
import { schedulableConceptIds } from "@/grammar/concepts"
import { loadConceptStates, mergeConceptStates } from "@/storage/progressStore"
import { loadEnforcementRecord } from "@/storage/enforcementStore"
import { loadDailyMetrics } from "@/storage/dailyMetricsStore"
import { dateKey, type EnforcementRecord } from "@/core/dailyEnforcement"
import { rankConceptStates } from "@/core/scheduler"
import type { ConceptState } from "@/types/conceptState"
import type { DailyMetrics } from "@/core/dailyMetrics"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

type Snapshot = {
  states: ConceptState[]
  ranking: ConceptState[]
  overdue: string[]
  enforcement: EnforcementRecord
  metrics: DailyMetrics
  loadedAt: number
}

export default function DevPage() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const isProduction = process.env.NODE_ENV === "production"

  function load() {
    const today = dateKey(new Date())
    const states = mergeConceptStates(
      loadConceptStates(),
      schedulableConceptIds
    )
    const now = new Date().getTime()
    setSnapshot({
      states,
      ranking: rankConceptStates(states, now),
      overdue: states.filter((s) => s.nextReview <= now).map((s) => s.id),
      enforcement: loadEnforcementRecord(),
      metrics: loadDailyMetrics(today),
      loadedAt: now,
    })
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Diagnostics</h1>
          <Badge tone="warn">Dev only</Badge>
        </div>
        <p className="text-sm text-ink-soft">
          Raw persisted state for debugging. Not part of the learner flow.
        </p>
      </header>

      {isProduction ? (
        <Card>
          <p className="text-sm text-ink-soft">
            Diagnostics are disabled in production builds.
          </p>
        </Card>
      ) : (
        <>
          <Button onClick={load}>Load current state</Button>

          {snapshot && (
            <div className="space-y-4">
              <Card>
                <h2 className="mb-2 text-sm font-medium text-ink-soft">
                  Enforcement
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 text-xs text-ink">
                  {JSON.stringify(snapshot.enforcement, null, 2)}
                </pre>
              </Card>

              <Card>
                <h2 className="mb-2 text-sm font-medium text-ink-soft">
                  Scheduler ranking ({snapshot.overdue.length} overdue)
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 text-xs text-ink">
                  {JSON.stringify(
                    snapshot.ranking.map((s) => ({
                      id: s.id,
                      strength: s.strength,
                      stability: s.stability,
                      failureCount: s.failureCount,
                      overdue: snapshot.overdue.includes(s.id),
                    })),
                    null,
                    2
                  )}
                </pre>
              </Card>

              <Card>
                <h2 className="mb-2 text-sm font-medium text-ink-soft">
                  Daily metrics
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 text-xs text-ink">
                  {JSON.stringify(snapshot.metrics, null, 2)}
                </pre>
              </Card>

              <Card>
                <h2 className="mb-2 text-sm font-medium text-ink-soft">
                  Concept states
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 text-xs text-ink">
                  {JSON.stringify(snapshot.states, null, 2)}
                </pre>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
