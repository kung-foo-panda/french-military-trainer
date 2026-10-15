import test from "node:test"
import assert from "node:assert/strict"
import {
  LocalProgressRepository,
  type StorageLike,
} from "../src/data/local/LocalProgressRepository"
import { LEGACY_KEYS, PROGRESS_KEY } from "../src/data/schema"
import { createInitialConceptState } from "../src/types/conceptState"

class MemoryStorage implements StorageLike {
  private map = new Map<string, string>()

  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value)
  }

  removeItem(key: string): void {
    this.map.delete(key)
  }
}

function seedState(id: string, strength = 50) {
  return { ...createInitialConceptState(id), strength }
}

test("round-trips concept states through the single snapshot", () => {
  const storage = new MemoryStorage()
  const repo = new LocalProgressRepository(storage)
  const states = [seedState("a", 10), seedState("b", 20)]

  repo.saveConceptStates(states)

  const reloaded = new LocalProgressRepository(storage)
  assert.deepEqual(reloaded.loadConceptStates(), states)
  assert.ok(storage.getItem(PROGRESS_KEY), "writes the snapshot key")
})

test("migrates the three legacy keys and preserves orphaned ids", () => {
  const storage = new MemoryStorage()
  storage.setItem(
    LEGACY_KEYS.conceptStates,
    JSON.stringify([seedState("present_etre", 30), seedState("orphan_id", 12)])
  )
  storage.setItem(
    LEGACY_KEYS.enforcement,
    JSON.stringify({
      lastActiveDate: "2026-01-01",
      streakDays: 3,
      targetToday: 25,
      completedToday: 25,
      skipDebt: false,
    })
  )

  const repo = new LocalProgressRepository(storage)
  const ids = repo.loadConceptStates().map((s) => s.id).sort()

  assert.deepEqual(ids, ["orphan_id", "present_etre"])
  assert.equal(repo.loadEnforcement().streakDays, 3)
  assert.ok(storage.getItem(PROGRESS_KEY), "persists the migrated snapshot")
})

test("falls back to defaults on a corrupt snapshot", () => {
  const storage = new MemoryStorage()
  storage.setItem(PROGRESS_KEY, "{not valid json")

  const repo = new LocalProgressRepository(storage)
  assert.deepEqual(repo.loadConceptStates(), [])
  assert.equal(repo.loadEnforcement().streakDays, 0)
  assert.equal(repo.loadMetrics("2026-01-01").sessions.length, 0)
})

test("upgrades an older snapshot in place", () => {
  const storage = new MemoryStorage()
  storage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ version: 1, conceptStates: [seedState("present_aller")] })
  )

  const repo = new LocalProgressRepository(storage)
  assert.equal(repo.loadConceptStates().length, 1)
  assert.equal(repo.loadSnapshot().version, 3)
})

test("keeps unknown concept ids across a save/load cycle", () => {
  const storage = new MemoryStorage()
  const repo = new LocalProgressRepository(storage)

  repo.saveConceptStates([seedState("known"), seedState("ghost")])

  const reloaded = new LocalProgressRepository(storage).loadConceptStates()
  assert.ok(reloaded.some((s) => s.id === "ghost"))
  assert.ok(reloaded.some((s) => s.id === "known"))
})

test("reset metrics when the stored day differs", () => {
  const storage = new MemoryStorage()
  const repo = new LocalProgressRepository(storage)
  repo.saveMetrics({
    date: "2026-01-01",
    sessions: [
      {
        startedAt: 0,
        durationMs: 0,
        correct: 1,
        incorrect: 0,
        totalTimeMs: 0,
        conceptStats: {},
      },
    ],
  })

  assert.equal(repo.loadMetrics("2026-01-01").sessions.length, 1)
  assert.equal(repo.loadMetrics("2026-01-02").sessions.length, 0)
})

function day(date: string, startedAt: number) {
  return {
    date,
    sessions: [
      {
        startedAt,
        durationMs: 0,
        correct: 1,
        incorrect: 0,
        totalTimeMs: 0,
        conceptStats: {},
      },
    ],
  }
}

test("accumulates a multi-day history, newest first, upserting per day", () => {
  const storage = new MemoryStorage()
  const repo = new LocalProgressRepository(storage)

  repo.saveMetrics(day("2026-01-01", 1))
  repo.saveMetrics(day("2026-01-03", 3))
  repo.saveMetrics(day("2026-01-02", 2))

  assert.deepEqual(
    repo.loadHistory().map((m) => m.date),
    ["2026-01-03", "2026-01-02", "2026-01-01"]
  )

  repo.saveMetrics({
    ...day("2026-01-02", 9),
    sessions: [...day("2026-01-02", 2).sessions, day("2026-01-02", 9).sessions[0]],
  })
  assert.equal(repo.loadMetrics("2026-01-02").sessions.length, 2)
  assert.equal(repo.loadHistory().length, 3)
})

test("migrates a legacy single-day metrics record into history", () => {
  const storage = new MemoryStorage()
  storage.setItem(LEGACY_KEYS.metrics, JSON.stringify(day("2026-01-01", 1)))

  const repo = new LocalProgressRepository(storage)
  assert.equal(repo.loadHistory().length, 1)
  assert.equal(repo.loadHistory()[0].date, "2026-01-01")
})
