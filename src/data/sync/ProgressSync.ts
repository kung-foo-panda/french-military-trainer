import type { ProgressRepository } from "../ProgressRepository"
import { emptySnapshot, type ProgressSnapshot } from "../schema"
import type { AsyncProgressRepository } from "./AsyncProgressRepository"
import { mergeSnapshots } from "./merge"

/**
 * Phase 3 — local-first reconciliation. Pull the remote snapshot, merge it with
 * the local one, write the result back locally, then push it remotely.
 */
export class ProgressSync {
  constructor(
    private readonly remote: AsyncProgressRepository,
    private readonly local: ProgressRepository
  ) {}

  /** Reconcile both sides, keeping the newest data from each. */
  async pull(uid: string): Promise<ProgressSnapshot> {
    const remoteSnapshot = await this.remote.load(uid)
    const merged = mergeSnapshots(this.local.loadSnapshot(), remoteSnapshot)
    this.local.saveSnapshot(merged)
    await this.remote.save(uid, merged)
    return merged
  }

  /**
   * Take the remote account's data as the source of truth, discarding local
   * data (used when a *different* user signs in on a shared device).
   */
  async replaceWithRemote(uid: string): Promise<ProgressSnapshot> {
    const remoteSnapshot = await this.remote.load(uid)
    const next = remoteSnapshot ?? emptySnapshot()
    this.local.saveSnapshot(next)
    if (!remoteSnapshot) await this.remote.save(uid, next)
    return next
  }

  async push(uid: string): Promise<void> {
    await this.remote.save(uid, this.local.loadSnapshot())
  }
}
