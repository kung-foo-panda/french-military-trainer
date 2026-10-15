import { encodedBatches, type EncodedBatch } from "../content/encoded"
import type { EncodedConcept } from "../ai/encodedConcept"
import { chapters } from "../content/chapters"
import { rules } from "../content/rules"
import { concepts } from "../grammar/concepts"
import type { Concept } from "../types/concept"
import type { Catalog, DomainConcept } from "./concept"
import type { Example } from "./example"
import { exerciseTypesForConcept } from "./exerciseType"
import { source, type SourceRef } from "./provenance"

const FALLBACK_SOURCE: SourceRef = source("manual", "scaffold:person-drills")

const chapterById = new Map(chapters.map((c) => [c.id, c]))

/** Phase 6 — provenance for an encoded batch, derived from its registry entry. */
function batchSource(batch: EncodedBatch): SourceRef {
  return source("ai", `${batch.id}:ch${batch.data.chapter}`)
}

function chapterIdFor(concept: Concept): string {
  if (concept.chapterId && chapterById.has(concept.chapterId)) {
    return concept.chapterId
  }
  return "ch-foundations"
}

function sourceFor(concept: Concept): SourceRef {
  if (concept.source) return concept.source
  return chapterById.get(chapterIdFor(concept))?.source ?? FALLBACK_SOURCE
}

const encodedConcepts: { concept: EncodedConcept; chapterId: string; source: SourceRef }[] =
  encodedBatches.flatMap((batch) =>
    batch.data.concepts.map((concept) => ({
      concept,
      chapterId: batch.chapterId,
      source: batchSource(batch),
    }))
  )

function buildExamples(): Example[] {
  const examples: Example[] = []

  for (const concept of concepts) {
    if (concept.kind !== "translate") continue
    concept.examples.forEach((ex, i) => {
      examples.push({
        id: `${concept.id}.ex${i + 1}`,
        conceptId: concept.id,
        french: ex.french,
        english: ex.english,
        source: sourceFor(concept),
      })
    })
  }

  const runtimeIds = new Set(concepts.map((c) => c.id))
  for (const { concept: encoded, source: src } of encodedConcepts) {
    if (runtimeIds.has(encoded.id)) continue
    encoded.examples.forEach((ex, i) => {
      examples.push({
        id: `${encoded.id}.ex${i + 1}`,
        conceptId: encoded.id,
        french: ex.french,
        english: ex.english,
        source: src,
      })
    })
  }

  return examples
}

const examples = buildExamples()

const ruleIdsByChapter = new Map<string, string[]>()
for (const rule of rules) {
  const list = ruleIdsByChapter.get(rule.chapterId) ?? []
  list.push(rule.id)
  ruleIdsByChapter.set(rule.chapterId, list)
}

const exampleIdsByConcept = new Map<string, string[]>()
for (const example of examples) {
  const list = exampleIdsByConcept.get(example.conceptId) ?? []
  list.push(example.id)
  exampleIdsByConcept.set(example.conceptId, list)
}

const dependenciesById = new Map<string, string[]>(
  encodedConcepts.map(({ concept }) => [concept.id, concept.dependencies])
)

const runtimeConcepts: DomainConcept[] = concepts.map((concept) => {
  const chapterId = chapterIdFor(concept)
  return {
    id: concept.id,
    name: concept.name,
    explanation: concept.explanation,
    difficulty: concept.difficulty,
    kind: concept.kind,
    chapterId,
    ruleIds: ruleIdsByChapter.get(chapterId) ?? [],
    exampleIds: exampleIdsByConcept.get(concept.id) ?? [],
    exerciseTypes: exerciseTypesForConcept(concept),
    trainable: concept.schedulable !== false,
    dependencies: dependenciesById.get(concept.id) ?? [],
    runtime: true,
    source: sourceFor(concept),
  }
})

const runtimeIds = new Set(concepts.map((c) => c.id))

/** Encoded concepts with no runtime counterpart, kept for future generators. */
const pendingConcepts: DomainConcept[] = encodedConcepts
  .filter(({ concept }) => !runtimeIds.has(concept.id))
  .map(({ concept: encoded, chapterId, source: src }) => ({
    id: encoded.id,
    name: encoded.name,
    explanation: encoded.explanation,
    difficulty: encoded.difficulty,
    kind: "translate",
    chapterId,
    ruleIds: ruleIdsByChapter.get(chapterId) ?? [],
    exampleIds: exampleIdsByConcept.get(encoded.id) ?? [],
    exerciseTypes: [],
    trainable: encoded.trainable,
    dependencies: encoded.dependencies,
    runtime: false,
    source: src,
  }))

export const catalog: Catalog = {
  chapters,
  rules,
  examples,
  concepts: [...runtimeConcepts, ...pendingConcepts],
}

export const domainConcepts: DomainConcept[] = catalog.concepts

export function domainConcept(id: string): DomainConcept | undefined {
  return catalog.concepts.find((c) => c.id === id)
}
