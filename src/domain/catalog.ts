import { encodedBatch1 } from "../content/encoded/batch1"
import { chapters } from "../content/chapters"
import { rules } from "../content/rules"
import { concepts } from "../grammar/concepts"
import type { Concept } from "../types/concept"
import type { Catalog, DomainConcept } from "./concept"
import type { Example } from "./example"
import { exerciseTypesForConcept } from "./exerciseType"
import { source, type SourceRef } from "./provenance"

const FALLBACK_SOURCE: SourceRef = source("manual", "scaffold:person-drills")
const ENCODED_SOURCE: SourceRef = source("ai", `batch1:ch${encodedBatch1.chapter}`)

const chapterById = new Map(chapters.map((c) => [c.id, c]))

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
  for (const encoded of encodedBatch1.concepts) {
    if (runtimeIds.has(encoded.id)) continue
    encoded.examples.forEach((ex, i) => {
      examples.push({
        id: `${encoded.id}.ex${i + 1}`,
        conceptId: encoded.id,
        french: ex.french,
        english: ex.english,
        source: ENCODED_SOURCE,
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

const dependenciesById = new Map(
  encodedBatch1.concepts.map((c) => [c.id, c.dependencies])
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
const pendingConcepts: DomainConcept[] = encodedBatch1.concepts
  .filter((c) => !runtimeIds.has(c.id))
  .map((encoded) => ({
    id: encoded.id,
    name: encoded.name,
    explanation: encoded.explanation,
    difficulty: encoded.difficulty,
    kind: "translate",
    chapterId: "ch-aller-faire",
    ruleIds: ruleIdsByChapter.get("ch-aller-faire") ?? [],
    exampleIds: exampleIdsByConcept.get(encoded.id) ?? [],
    exerciseTypes: [],
    trainable: encoded.trainable,
    dependencies: encoded.dependencies,
    runtime: false,
    source: ENCODED_SOURCE,
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
