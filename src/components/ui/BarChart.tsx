export type BarDatum = {
  label: string
  value: number
  hint?: string
}

/**
 * Phase 5 — a dependency-free vertical bar chart for progress history. Bars are
 * sized from `max` (defaults to the largest value) and each column shows its
 * label; `hint`/`formatValue` surface details on hover.
 */
export function BarChart({
  points,
  max,
  height = 96,
  formatValue,
  emptyLabel,
}: {
  points: BarDatum[]
  max?: number
  height?: number
  formatValue?: (value: number) => string
  /** Rendered when there are no points; pass `t("chart.noData")`. */
  emptyLabel: string
}) {
  if (points.length === 0) {
    return <p className="text-sm text-ink-soft">{emptyLabel}</p>
  }

  const safeMax = max ?? Math.max(1, ...points.map((p) => p.value))
  const barMax = Math.max(8, height - 16)

  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {points.map((point, i) => {
        const pct = safeMax > 0 ? Math.min(100, (point.value / safeMax) * 100) : 0
        const title = `${point.label}${
          point.hint
            ? ` · ${point.hint}`
            : formatValue
              ? ` · ${formatValue(point.value)}`
              : ""
        }`
        return (
          <div
            key={`${point.label}-${i}`}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
            title={title}
          >
            <div
              className="w-full rounded-t bg-accent/80"
              style={{ height: `${Math.max(2, Math.round((pct / 100) * barMax))}px` }}
            />
            <span className="w-full truncate text-center text-[10px] text-ink-faint">
              {point.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
