export type SourceKind = "pdf" | "ai" | "manual"

export type SourceRef = {
  kind: SourceKind
  ref: string
}

export function source(kind: SourceKind, ref: string): SourceRef {
  return { kind, ref }
}

export function isSourceRef(value: unknown): value is SourceRef {
  if (typeof value !== "object" || value === null) return false
  const s = value as Partial<SourceRef>
  return (
    (s.kind === "pdf" || s.kind === "ai" || s.kind === "manual") &&
    typeof s.ref === "string" &&
    s.ref.length > 0
  )
}
