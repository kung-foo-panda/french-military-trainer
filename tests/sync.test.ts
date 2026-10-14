import test from "node:test"
import assert from "node:assert/strict"
import {
  mergeConceptStates,
  mergeEnforcement,
  mergeSnapshots,
} from "../src/data/sync/merge"
import { ProgressSync } from "../src/data/sync/ProgressSync"
import type { AsyncProgressRepository } from "../src/data/sync/AsyncProgressRepository"
import {
  LocalProgressRepository,
  type StorageLike,
} from "../src/data/local/LocalProgressRepository"
import { PROGRESS_SCHEMA_VERSION, type ProgressSnapshot } from "../src/data/schema"
import { DEFAULT_ENFORCEMENT } from "../src/core/dailyEnforcement"
import { createInitialConceptState } from "../src/types/conceptState"

class MemoryStorage implements StorageLike {
  private map = new Map<string, string>()
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null
  }
  setItem(key: string, value: string) {
    this.map.set(key, value)
  }
  removeItem(key: string) {
    this.map.delete(key)
  }
}

function state(id: string, lastReviewed: number, strength = 50) {
  return { ...createInitialConceptState(id), strength, lastReviewed }
}

function snapshot(partial: Partial<ProgressSnapshot>): ProgressSnapshot {
  return {
    version: PROGRESS_SCHEMA_VERSION,
    conceptStates: [],
    enforcement: { ...DEFAULT_ENFORCEMENT },
    metrics: null,
    ...partial,
  }
}

test("mergeSnapshots with no remote returns local at the current version", () => {
  const local = snapshot({ conceptStates: [state("a", 5)] })
  const merged = mergeSnapshots(local, null)
  assert.equal(merged.version, PROGRESS_SCHEMA_VERSION)
  assert.deepEqual(merged.conceptStates, local.conceptStates)
})

test("mergeConceptStates keeps the most recently reviewed and unions ids", () => {
  const merged = mergeConceptStates(
    [state("a", 10, 30), state("b", 1, 40)],
    [state("a", 20, 90), state("c", 3, 10)]
  )
  const byId = new Map(merged.map((s) => [s.id, s]))
  assert.equal(byId.get("a")!.strength, 90)
  assert.equal(byId.get("b")!.strength, 40)
  assert.equal(byId.get("c")!.strength, 10)
})

test("mergeEnforcement prefers the later active date", () => {
  const local = { ...DEFAULT_ENFORCEMENT, lastActiveDate: "2026-01-01", streakDays: 1 }
  const remote = { ...DEFAULT_ENFORCEMENT, lastActiveDate: "2026-02-01", streakDays: 5 }
  assert.equal(mergeEnforcement(local, remote).streakDays, 5)
  assert.equal(mergeEnforcement(remote, local).streakDays, 5)
})

test("mergeEnforcement breaks ties on completed count", () => {
  const local = { ...DEFAULT_ENFORCEMENT, lastActiveDate: "2026-01-01", completedToday: 3 }
  const remote = { ...DEFAULT_ENFORCEMENT, lastActiveDate: "2026-01-01", completedToday: 9 }
  assert.equal(mergeEnforcement(local, remote).completedToday, 9)
})

test("mergeSnapshots merges same-day sessions without duplicates", () => {
  const session = (startedAt: number) => ({
    startedAt,
    durationMs: 0,
    correct: 1,
    incorrect: 0,
    totalTimeMs: 0,
    conceptStats: {},
  })
  const local = snapshot({
    metrics: { date: "2026-03-01", sessions: [session(100)] },
  })
  const remote = snapshot({
    metrics: { date: "2026-03-01", sessions: [session(100), session(200)] },
  })
  const merged = mergeSnapshots(local, remote)
  assert.equal(merged.metrics!.sessions.length, 2)
  assert.deepEqual(
    merged.metrics!.sessions.map((s) => s.startedAt),
    [100, 200]
  )
})

test("mergeSnapshots keeps the newer metrics day", () => {
  const local = snapshot({ metrics: { date: "2026-03-01", sessions: [] } })
  const remote = snapshot({ metrics: { date: "2026-03-05", sessions: [] } })
  assert.equal(mergeSnapshots(local, remote).metrics!.date, "2026-03-05")
})

test("ProgressSync.pull merges, persists locally, and pushes remotely", async () => {
  const storage = new MemoryStorage()
  const local = new LocalProgressRepository(storage)
  local.saveConceptStates([state("a", 10, 30)])

  const pushed: ProgressSnapshot[] = []
  const remote: AsyncProgressRepository = {
    async load() {
      return snapshot({ conceptStates: [state("a", 20, 80), state("b", 1, 10)] })
    },
    async save(_uid, snap) {
      pushed.push(snap)
    },
  }

  const merged = await new ProgressSync(remote, local).pull("uid-1")

  const byId = new Map(merged.conceptStates.map((s) => [s.id, s]))
  assert.equal(byId.get("a")!.strength, 80)
  assert.equal(byId.get("b")!.strength, 10)
  assert.equal(pushed.length, 1)
  assert.equal(local.loadConceptStates().length, merged.conceptStates.length)
})

test("ProgressSync.replaceWithRemote discards local data for a new account", async () => {
  const storage = new MemoryStorage()
  const local = new LocalProgressRepository(storage)
  local.saveConceptStates([state("local-only", 5, 30)])

  const remote: AsyncProgressRepository = {
    async load() {
      return snapshot({ conceptStates: [state("account", 1, 20)] })
    },
    async save() {},
  }

  const result = await new ProgressSync(remote, local).replaceWithRemote("uid-2")

  assert.deepEqual(result.conceptStates.map((s) => s.id), ["account"])
  assert.deepEqual(local.loadConceptStates().map((s) => s.id), ["account"])
})

test("ProgressSync.replaceWithRemote seeds an empty account when remote is missing", async () => {
  const storage = new MemoryStorage()
  const local = new LocalProgressRepository(storage)
  local.saveConceptStates([state("local-only", 5)])

  const saved: ProgressSnapshot[] = []
  const remote: AsyncProgressRepository = {
    async load() {
      return null
    },
    async save(_uid, snap) {
      saved.push(snap)
    },
  }

  const result = await new ProgressSync(remote, local).replaceWithRemote("uid-3")

  assert.deepEqual(result.conceptStates, [])
  assert.equal(saved.length, 1)
})
