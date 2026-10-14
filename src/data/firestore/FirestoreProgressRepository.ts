import { DEFAULT_ENFORCEMENT } from "../../core/dailyEnforcement"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { firebaseDb } from "@/lib/firebase"
import {
  isConceptState,
  isDailyMetrics,
  isEnforcementRecord,
} from "../local/guards"
import { PROGRESS_SCHEMA_VERSION, type ProgressSnapshot } from "../schema"
import type { AsyncProgressRepository } from "../sync/AsyncProgressRepository"

function coerce(data: unknown): ProgressSnapshot | null {
  if (typeof data !== "object" || data === null) return null
  const d = data as Record<string, unknown>
  return {
    version: PROGRESS_SCHEMA_VERSION,
    conceptStates: Array.isArray(d.conceptStates)
      ? d.conceptStates.filter(isConceptState)
      : [],
    enforcement: isEnforcementRecord(d.enforcement)
      ? d.enforcement
      : { ...DEFAULT_ENFORCEMENT },
    metrics: isDailyMetrics(d.metrics) ? d.metrics : null,
  }
}

/** Phase 3 — Firestore-backed per-user progress at users/{uid}/progress/main. */
export class FirestoreProgressRepository implements AsyncProgressRepository {
  private ref(uid: string) {
    return doc(firebaseDb(), "users", uid, "progress", "main")
  }

  async load(uid: string): Promise<ProgressSnapshot | null> {
    const snap = await getDoc(this.ref(uid))
    return snap.exists() ? coerce(snap.data()) : null
  }

  async save(uid: string, snapshot: ProgressSnapshot): Promise<void> {
    await setDoc(this.ref(uid), snapshot)
  }
}
