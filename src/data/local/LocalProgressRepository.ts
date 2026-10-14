import {
  DEFAULT_ENFORCEMENT,
  type EnforcementRecord,
} from "../../core/dailyEnforcement"
import { type DailyMetrics } from "../../core/dailyMetrics"
import type { ConceptState } from "../../types/conceptState"
import type { ProgressRepository } from "../ProgressRepository"
import {
  LEGACY_KEYS,
  PROGRESS_KEY,
  PROGRESS_SCHEMA_VERSION,
  type ProgressSnapshot,
} from "../schema"
import {
  isConceptState,
  isDailyMetrics,
  isEnforcementRecord,
} from "./guards"

export type StorageLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

/**
 * Phase 2 — localStorage implementation backed by a single versioned snapshot.
 *
 * On first load it migrates the three legacy keys (concept states, enforcement,
 * daily metrics) into one record. Concept states are carried over verbatim —
 * including ids that no longer exist in the current pool — so no learner
 * progress is silently dropped; the scheduler already filters unknown ids.
 */
export class LocalProgressRepository implements ProgressRepository {
  private current: ProgressSnapshot | null = null

  constructor(private readonly storage: StorageLike) {}

  loadSnapshot(): ProgressSnapshot {
    return this.ensure()
  }

  loadConceptStates(): ConceptState[] {
    return this.ensure().conceptStates
  }

  saveConceptStates(states: ConceptState[]): void {
    this.write({ ...this.ensure(), conceptStates: states })
  }

  loadEnforcement(): EnforcementRecord {
    return this.ensure().enforcement
  }

  saveEnforcement(record: EnforcementRecord): void {
    this.write({ ...this.ensure(), enforcement: record })
  }

  loadMetrics(date: string): DailyMetrics {
    const metrics = this.ensure().metrics
    if (metrics && metrics.date === date) return metrics
    return { date, sessions: [] }
  }

  saveMetrics(metrics: DailyMetrics): void {
    this.write({ ...this.ensure(), metrics })
  }

  clear(): void {
    this.storage.removeItem(PROGRESS_KEY)
    this.storage.removeItem(LEGACY_KEYS.conceptStates)
    this.storage.removeItem(LEGACY_KEYS.enforcement)
    this.storage.removeItem(LEGACY_KEYS.metrics)
    this.current = null
  }

  private ensure(): ProgressSnapshot {
    if (this.current) return this.current

    const main = this.readMain()
    if (main) {
      this.current = main
      return main
    }

    const migrated = this.migrate()
    this.write(migrated)
    return migrated
  }

  private parse(raw: string | null): unknown {
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  private readMain(): ProgressSnapshot | null {
    const parsed = this.parse(this.storage.getItem(PROGRESS_KEY))
    if (typeof parsed !== "object" || parsed === null) return null

    const p = parsed as Record<string, unknown>
    const conceptStates = Array.isArray(p.conceptStates)
      ? p.conceptStates.filter(isConceptState)
      : []
    const enforcement = isEnforcementRecord(p.enforcement)
      ? p.enforcement
      : { ...DEFAULT_ENFORCEMENT }
    const metrics = isDailyMetrics(p.metrics) ? p.metrics : null

    return {
      version: PROGRESS_SCHEMA_VERSION,
      conceptStates,
      enforcement,
      metrics,
    }
  }

  private migrate(): ProgressSnapshot {
    const conceptStates = this.readLegacyArray(
      LEGACY_KEYS.conceptStates,
      isConceptState
    )
    const enforcement = this.readLegacyOne(
      LEGACY_KEYS.enforcement,
      isEnforcementRecord
    )
    const metrics = this.readLegacyOne(LEGACY_KEYS.metrics, isDailyMetrics)

    return {
      version: PROGRESS_SCHEMA_VERSION,
      conceptStates,
      enforcement: enforcement ?? { ...DEFAULT_ENFORCEMENT },
      metrics: metrics ?? null,
    }
  }

  private readLegacyArray<T>(
    key: string,
    guard: (value: unknown) => value is T
  ): T[] {
    const parsed = this.parse(this.storage.getItem(key))
    return Array.isArray(parsed) ? parsed.filter(guard) : []
  }

  private readLegacyOne<T>(
    key: string,
    guard: (value: unknown) => value is T
  ): T | null {
    const parsed = this.parse(this.storage.getItem(key))
    return guard(parsed) ? parsed : null
  }

  private write(snapshot: ProgressSnapshot): void {
    this.current = snapshot
    this.storage.setItem(PROGRESS_KEY, JSON.stringify(snapshot))
  }
}
