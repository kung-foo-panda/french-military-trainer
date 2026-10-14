import type { SourceRef } from "./provenance"

export type Rule = {
  id: string
  chapterId: string
  text: string
  source: SourceRef
}
