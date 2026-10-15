import type { EnforcementRecord } from "../../core/dailyEnforcement"
import type { DailyMetrics, SessionMetric } from "../../core/dailyMetrics"
import type { ConceptState } from "../../types/conceptState"
import { PROGRESS_SCHEMA_VERSION, type ProgressSnapshot } from "../schema"

function newerState(a: ConceptState, b: ConceptState): ConceptState {
  return a.lastReviewed >= b.lastReviewed ? a : b
}

/** Union of concept states by id; the more recently reviewed one wins. */
export function mergeConceptStates(
  local: ConceptState[],
  remote: ConceptState[]
): ConceptState[] {
  const byId = new Map<string, ConceptState>()
  for (const state of local) byId.set(state.id, state)
  for (const state of remote) {
    const existing = byId.get(state.id)
    byId.set(state.id, existing ? newerState(existing, state) : state)
  }
  return [...byId.values()]
}

/** Later `lastActiveDate` wins; on a tie, the higher completed count wins. */
export function mergeEnforcement(
  local: EnforcementRecord,
  remote: EnforcementRecord
): EnforcementRecord {
  if (local.lastActiveDate === remote.lastActiveDate) {
    return local.completedToday >= remote.completedToday ? local : remote
  }
  if (local.lastActiveDate === null) return remote
  if (remote.lastActiveDate === null) return local
  return local.lastActiveDate > remote.lastActiveDate ? local : remote
}

function mergeDay(a: DailyMetrics, b: DailyMetrics): DailyMetrics {
  const byStart = new Map<number, SessionMetric>()
  for (const session of [...a.sessions, ...b.sessions]) {
    byStart.set(session.startedAt, session)
  }
  return {
    date: a.date,
    sessions: [...byStart.values()].sort((x, y) => x.startedAt - y.startedAt),
  }
}

/** Union of days by date; same-day sessions merge without duplicates. */
export function mergeHistory(
  local: DailyMetrics[],
  remote: DailyMetrics[]
): DailyMetrics[] {
  const byDate = new Map<string, DailyMetrics>()
  for (const day of local) byDate.set(day.date, day)
  for (const day of remote) {
    const existing = byDate.get(day.date)
    byDate.set(day.date, existing ? mergeDay(existing, day) : day)
  }
  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date))
}

/** Deterministic two-way merge of a local and a remote snapshot. */
export function mergeSnapshots(
  local: ProgressSnapshot,
  remote: ProgressSnapshot | null
): ProgressSnapshot {
  if (!remote) return { ...local, version: PROGRESS_SCHEMA_VERSION }

  return {
    version: PROGRESS_SCHEMA_VERSION,
    conceptStates: mergeConceptStates(local.conceptStates, remote.conceptStates),
    enforcement: mergeEnforcement(local.enforcement, remote.enforcement),
    history: mergeHistory(local.history, remote.history),
  }
}
