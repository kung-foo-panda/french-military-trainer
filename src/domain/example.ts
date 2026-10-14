import type { SourceRef } from "./provenance"

export type Example = {
  id: string
  conceptId: string
  french: string
  english: string[]
  source: SourceRef
}
