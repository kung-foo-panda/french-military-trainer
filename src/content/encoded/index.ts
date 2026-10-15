import type { EncodedChapter } from "../../ai/encodedConcept"
import { encodedBatch1 } from "./batch1"
import { encodedBatch2 } from "./batch2"

/**
 * Phase 6 — the ordered registry of reviewed encoded chapters. Each batch
 * carries the content chapter it belongs to so the domain catalog can
 * reconcile and attribute it without hardcoding individual batches.
 */
export type EncodedBatch = {
  id: string
  chapterId: string
  data: EncodedChapter
}

export const encodedBatches: EncodedBatch[] = [
  { id: "batch1", chapterId: "ch-aller-faire", data: encodedBatch1 },
  { id: "batch2", chapterId: "ch-irregular-common", data: encodedBatch2 },
]
