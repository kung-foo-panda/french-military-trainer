import { emptyDailyMetrics, type DailyMetrics } from "../core/dailyMetrics"
import { progressRepository } from "../data"

/** Load metrics for `date`, resetting when the stored record is from another day. */
export function loadDailyMetrics(date: string): DailyMetrics {
  return progressRepository()?.loadMetrics(date) ?? emptyDailyMetrics(date)
}

export function saveDailyMetrics(metrics: DailyMetrics) {
  progressRepository()?.saveMetrics(metrics)
}

/** Every practiced day, newest first (Phase 5 progress history). */
export function loadMetricsHistory(): DailyMetrics[] {
  return progressRepository()?.loadHistory() ?? []
}
