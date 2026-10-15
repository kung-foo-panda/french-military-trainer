import { catalog } from "@/domain/catalog"
import { EXERCISE_TYPES } from "@/domain/exerciseType"
import type { SourceKind } from "@/domain/provenance"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

const EXERCISE_LABEL = new Map(EXERCISE_TYPES.map((t) => [t.id, t.label]))

const SOURCE_TONE: Record<SourceKind, "neutral" | "accent" | "success"> = {
  pdf: "neutral",
  ai: "accent",
  manual: "success",
}

const rulesByChapter = new Map<string, typeof catalog.rules>()
for (const rule of catalog.rules) {
  const list = rulesByChapter.get(rule.chapterId) ?? []
  list.push(rule)
  rulesByChapter.set(rule.chapterId, list)
}

const examplesByConcept = new Map<string, typeof catalog.examples>()
for (const example of catalog.examples) {
  const list = examplesByConcept.get(example.conceptId) ?? []
  list.push(example)
  examplesByConcept.set(example.conceptId, list)
}

const conceptsByChapter = new Map<string, typeof catalog.concepts>()
for (const concept of catalog.concepts) {
  const list = conceptsByChapter.get(concept.chapterId) ?? []
  list.push(concept)
  conceptsByChapter.set(concept.chapterId, list)
}

const orderedChapters = [...catalog.chapters].sort((a, b) => a.number - b.number)
const trainableCount = catalog.concepts.filter((c) => c.trainable).length

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Grammar Library</h1>
        <p className="text-sm text-ink-soft">
          {trainableCount} concepts in the training rotation across{" "}
          {orderedChapters.length} chapters. Concepts marked “Reference” are kept
          for manual practice only.
        </p>
      </header>

      {orderedChapters.map((chapter) => {
        const rules = rulesByChapter.get(chapter.id) ?? []
        const chapterConcepts = conceptsByChapter.get(chapter.id) ?? []

        return (
          <Card key={chapter.id} className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-faint">
                  Chapter {chapter.number}
                </p>
                <h2 className="text-lg font-medium text-ink">{chapter.title}</h2>
              </div>
              <Badge tone={SOURCE_TONE[chapter.source.kind]}>
                {chapter.source.kind} · {chapter.source.ref}
              </Badge>
            </div>

            {rules.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-ink-soft">Rules</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
                  {rules.map((rule) => (
                    <li key={rule.id}>{rule.text}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {chapterConcepts.map((concept) => {
                const examples = examplesByConcept.get(concept.id) ?? []
                return (
                  <div
                    key={concept.id}
                    className="rounded-xl border border-border bg-surface-2 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium text-ink">{concept.name}</h3>
                      <Badge tone={concept.trainable ? "accent" : "neutral"}>
                        {concept.trainable ? "In rotation" : "Reference"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">
                      {concept.explanation}
                    </p>

                    {concept.exerciseTypes.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {concept.exerciseTypes.map((type) => (
                          <span
                            key={type}
                            className="rounded-full bg-surface px-2 py-0.5 text-xs text-ink-soft"
                          >
                            {EXERCISE_LABEL.get(type) ?? type}
                          </span>
                        ))}
                      </div>
                    )}

                    {examples.length > 0 && (
                      <ul className="mt-3 space-y-0.5 text-sm">
                        {examples.map((example) => (
                          <li key={example.id} className="text-ink-soft">
                            <span className="text-ink">{example.french}</span>
                            {" — "}
                            {example.english.join("; ")}
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="mt-3 text-xs text-ink-faint">
                      {concept.kind} · difficulty {concept.difficulty}
                      {concept.runtime ? "" : " · encoded"}
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
