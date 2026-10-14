import type { SourceRef } from "./provenance"

export type Chapter = {
  id: string
  number: number
  title: string
  source: SourceRef
}
