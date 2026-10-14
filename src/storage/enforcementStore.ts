import {
  DEFAULT_ENFORCEMENT,
  type EnforcementRecord,
} from "../core/dailyEnforcement"

const KEY = "french_trainer_enforcement"

function isEnforcementRecord(value: unknown): value is EnforcementRecord {
  if (typeof value !== "object" || value === null) return false

  const r = value as Partial<EnforcementRecord>
  return (
    (r.lastActiveDate === null || typeof r.lastActiveDate === "string") &&
    typeof r.streakDays === "number" &&
    typeof r.targetToday === "number" &&
    typeof r.completedToday === "number" &&
    typeof r.skipDebt === "boolean"
  )
}

export function loadEnforcementRecord(): EnforcementRecord {
  if (typeof window === "undefined") return { ...DEFAULT_ENFORCEMENT }

  const raw = localStorage.getItem(KEY)
  if (!raw) return { ...DEFAULT_ENFORCEMENT }

  try {
    const parsed: unknown = JSON.parse(raw)
    return isEnforcementRecord(parsed) ? parsed : { ...DEFAULT_ENFORCEMENT }
  } catch {
    return { ...DEFAULT_ENFORCEMENT }
  }
}

export function saveEnforcementRecord(record: EnforcementRecord) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(record))
}
