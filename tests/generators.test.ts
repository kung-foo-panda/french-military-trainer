import { test } from "node:test"
import assert from "node:assert/strict"
import { concepts } from "../src/grammar/concepts"
import { GENERATOR_BY_KIND } from "../src/core/generators/registry"
import { evaluateAnswer, type EvalMeta } from "../src/core/evaluator"
import type { Concept } from "../src/types/concept"
import type { Question } from "../src/types/question"

type AnyGenerator = (concept: Concept) => Question

const generatorFor = (kind: Concept["kind"]): AnyGenerator =>
  GENERATOR_BY_KIND[kind] as AnyGenerator

function metaFromQuestion(q: Question): EvalMeta {
  return {
    mode: q.mode,
    strict: false,
    infinitive: q.infinitive,
    subject: q.subject,
    stem: q.stem,
    expectedEnding: q.expectedEnding,
    auxiliary: q.auxiliary,
    participle: q.participle,
    agreement: q.agreement,
  }
}

const RUNS = 50

test("every concept kind has a wired generator", () => {
  assert.equal(Object.keys(GENERATOR_BY_KIND).length, 15)
})

test("each generated question accepts its own answer", () => {
  for (const concept of concepts) {
    const generate = generatorFor(concept.kind)
    for (let i = 0; i < RUNS; i++) {
      const question = generate(concept)
      const result = evaluateAnswer(
        question.answers[0],
        question.answers,
        metaFromQuestion(question)
      )
      assert.equal(
        result.correct,
        true,
        `${concept.id} (${concept.kind}) answer "${question.answers[0]}" rejected as ${result.errorType}`
      )
      assert.equal(question.conceptId, concept.id)
    }
  }
})

test("detection drills expose clickable choices containing the answer", () => {
  const concept = concepts.find((c) => c.kind === "detect")
  assert.ok(concept)
  const question = generatorFor("detect")(concept)
  assert.ok(Array.isArray(question.choices) && question.choices.length > 0)
  assert.ok(question.choices.includes(question.answers[0]))
})
