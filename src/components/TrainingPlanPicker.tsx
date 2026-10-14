"use client"

import { useMemo, type ReactNode } from "react"
import { chapters } from "@/content/chapters"
import {
  EXERCISE_TYPES,
  exerciseTypesForConcept,
  type ExerciseTypeId,
} from "@/domain/exerciseType"
import { concepts, schedulableConceptIds } from "@/grammar/concepts"
import {
  resolveTrainingPool,
  type TrainingPlan,
} from "@/core/trainingPlan"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

const SCHEDULABLE = new Set(schedulableConceptIds)

function toggle(list: string[] | null, id: string): string[] | null {
  const set = new Set(list ?? [])
  if (set.has(id)) set.delete(id)
  else set.add(id)
  return set.size === 0 ? null : [...set]
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-accent-soft text-accent-strong"
          : "bg-surface-2 text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  )
}

/**
 * Phase 4 — pick which chapters and exercise types the scheduler may draw from.
 * An empty selection means "no restriction"; changing the plan restarts the
 * session so every drill honours the new focus.
 */
export function TrainingPlanPicker({
  plan,
  onChange,
}: {
  plan: TrainingPlan
  onChange: (plan: TrainingPlan) => void
}) {
  const availableChapters = useMemo(
    () =>
      chapters.filter((ch) =>
        concepts.some((c) => SCHEDULABLE.has(c.id) && c.chapterId === ch.id)
      ),
    []
  )

  const availableTypes = useMemo(() => {
    const ids = new Set<ExerciseTypeId>()
    for (const c of concepts) {
      if (!SCHEDULABLE.has(c.id)) continue
      for (const t of exerciseTypesForConcept(c)) ids.add(t)
    }
    return EXERCISE_TYPES.filter((t) => ids.has(t.id))
  }, [])

  const poolSize = useMemo(() => resolveTrainingPool(plan).length, [plan])
  const focused = poolSize < schedulableConceptIds.length

  const chapterSelected = (id: string) => plan.chapterIds?.includes(id) ?? false
  const typeSelected = (id: ExerciseTypeId) =>
    plan.exerciseTypes?.includes(id) ?? false

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
            Training focus
          </span>
          <Badge tone={focused ? "accent" : "neutral"}>
            {poolSize} of {schedulableConceptIds.length} concepts
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!focused}
          onClick={() => onChange({ chapterIds: null, conceptIds: null, exerciseTypes: null })}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-ink-soft">Chapters</p>
        <div className="flex flex-wrap gap-2">
          {availableChapters.map((ch) => (
            <Chip
              key={ch.id}
              active={chapterSelected(ch.id)}
              onClick={() =>
                onChange({ ...plan, chapterIds: toggle(plan.chapterIds, ch.id) })
              }
            >
              {ch.title}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-ink-soft">Exercise types</p>
        <div className="flex flex-wrap gap-2">
          {availableTypes.map((t) => (
            <Chip
              key={t.id}
              active={typeSelected(t.id)}
              onClick={() =>
                onChange({
                  ...plan,
                  exerciseTypes: toggle(plan.exerciseTypes, t.id) as
                    | ExerciseTypeId[]
                    | null,
                })
              }
            >
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-faint">
        Selecting nothing trains everything. Changing the focus starts a new
        session.
      </p>
    </div>
  )
}
