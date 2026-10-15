import test from "node:test"
import assert from "node:assert/strict"
import { catalog, domainConcepts } from "../src/domain/catalog"
import { validateCatalog } from "../src/domain/validate"
import { EXERCISE_TYPES } from "../src/domain/exerciseType"
import { concepts } from "../src/grammar/concepts"
import { encodedBatches } from "../src/content/encoded"
import { validateEncodedChapter } from "../src/ai/encodedConcept"

test("catalog validates cleanly", () => {
  const result = validateCatalog(catalog)
  assert.deepEqual(result.errors, [])
  assert.equal(result.ok, true)
})

test("every runtime concept is expressible in the catalog", () => {
  assert.equal(domainConcepts.length, concepts.length)

  for (const concept of concepts) {
    const domain = domainConcepts.find((c) => c.id === concept.id)
    assert.ok(domain, `missing domain concept ${concept.id}`)
    assert.equal(domain.runtime, true)
    assert.ok(domain.source.kind)
    assert.ok(domain.source.ref.length > 0)
    assert.ok(domain.exerciseTypes.length >= 1, `${concept.id} has no exercise types`)
    assert.ok(domain.ruleIds.length >= 1, `${concept.id} has no rules`)
  }
})

test("the runtime pool is exactly the 31 schedulable concepts", () => {
  const schedulable = domainConcepts.filter((c) => c.trainable)
  assert.equal(schedulable.length, 31)
})

test("every chapter has at least one concept", () => {
  for (const chapter of catalog.chapters) {
    const owned = domainConcepts.filter((c) => c.chapterId === chapter.id)
    assert.ok(owned.length >= 1, `chapter ${chapter.id} has no concepts`)
  }
})

test("every encoded batch validates against the encoding shape", () => {
  for (const batch of encodedBatches) {
    const result = validateEncodedChapter(batch.data)
    assert.ok(
      result.ok,
      `batch ${batch.id} failed validation: ${
        result.ok ? "" : result.errors.join("; ")
      }`
    )
  }
})

test("every encoded batch concept reconciles to a runtime id", () => {
  const runtimeIds = new Set(concepts.map((c) => c.id))
  for (const batch of encodedBatches) {
    for (const encoded of batch.data.concepts) {
      assert.ok(
        runtimeIds.has(encoded.id),
        `${batch.id} ${encoded.id} is not runtime`
      )
    }
  }
})

test("all exercise types are represented by at least one concept", () => {
  const used = new Set(domainConcepts.flatMap((c) => c.exerciseTypes))
  for (const type of EXERCISE_TYPES) {
    assert.ok(used.has(type.id), `unused exercise type ${type.id}`)
  }
})

test("validator surfaces duplicate and dangling references", () => {
  const base = domainConcepts[0]
  const broken = {
    chapters: [...catalog.chapters, catalog.chapters[0]],
    rules: [
      {
        id: "r-x",
        chapterId: "nope",
        text: "t",
        source: { kind: "manual" as const, ref: "x" },
      },
    ],
    examples: [],
    concepts: [
      { ...base, chapterId: "nope", ruleIds: ["missing"], exampleIds: ["missing"] },
    ],
  }

  const result = validateCatalog(broken)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((e) => e.includes("duplicate chapter id")))
  assert.ok(result.errors.some((e) => e.includes("unknown chapter")))
  assert.ok(result.errors.some((e) => e.includes("unknown rule")))
  assert.ok(result.errors.some((e) => e.includes("unknown example")))
})
