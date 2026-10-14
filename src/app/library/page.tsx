import { concepts, schedulableConceptIds } from "@/grammar/concepts"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Grammar Library</h1>
        <p className="text-sm text-ink-soft">
          {schedulableConceptIds.length} concepts in the training rotation.
          Concepts marked “Reference” are kept for manual practice only.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {concepts.map((concept) => (
          <Card key={concept.id}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-medium text-ink">{concept.name}</h2>
              <Badge tone={concept.schedulable === false ? "neutral" : "accent"}>
                {concept.schedulable === false ? "Reference" : "In rotation"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{concept.explanation}</p>
            <p className="mt-2 text-xs text-ink-faint">
              {concept.kind} · difficulty {concept.difficulty}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
