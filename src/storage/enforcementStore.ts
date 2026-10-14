import {
  DEFAULT_ENFORCEMENT,
  type EnforcementRecord,
} from "../core/dailyEnforcement"
import { progressRepository } from "../data"

export function loadEnforcementRecord(): EnforcementRecord {
  return progressRepository()?.loadEnforcement() ?? { ...DEFAULT_ENFORCEMENT }
}

export function saveEnforcementRecord(record: EnforcementRecord) {
  progressRepository()?.saveEnforcement(record)
}
