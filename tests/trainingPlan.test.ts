import { test } from "node:test"
import assert from "node:assert/strict"
import {
  DEFAULT_TRAINING_PLAN,
  isDefaultTrainingPlan,
  resolveTrainingPool,
} from "../src/core/trainingPlan"
import { planNextQuestion, selectNextConcept } from "../src/core/sessionEngine"
import {
  exerciseTypesForConcept,
  type ExerciseTypeId,
} from "../src/domain/exerciseType"
import { concepts, schedulableConceptIds } from "../src/grammar/concepts"
import {
  createInitialConceptState,
  type ConceptState,
} from "../src/types/conceptState"

const BY_ID = new Map(concepts.map((c) => [c.id, c]))

function allStates(): ConceptState[] {
  return schedulableConceptIds.map(createInitialConceptState)
}

test("default plan keeps the whole schedulable pool", () => {
  const pool = resolveTrainingPool(DEFAULT_TRAINING_PLAN)
  assert.equal(pool.length, schedulableConceptIds.length)
  assert.ok(isDefaultTrainingPlan(DEFAULT_TRAINING_PLAN))
})

test("chapter filter narrows to that chapter only", () => {
  const pool = resolveTrainingPool({
    ...DEFAULT_TRAINING_PLAN,
    chapterIds: ["ch-passe-compose"],
  })
  assert.ok(pool.length > 0)
  assert.ok(
    pool.every((id) => BY_ID.get(id)?.chapterId === "ch-passe-compose")
  )
})

test("exercise-type filter narrows by produced type", () => {
  const pool = resolveTrainingPool({
    ...DEFAULT_TRAINING_PLAN,
    exerciseTypes: ["express_near_future"],
  })
  assert.deepEqual(pool, ["immediate_future"])
})

test("concept filter intersects the schedulable pool", () => {
  const pool = resolveTrainingPool({
    ...DEFAULT_TRAINING_PLAN,
    conceptIds: ["present_aller", "etre_1s"],
  })
  assert.deepEqual(pool, ["present_aller"])
})

test("every exercise type offered by the picker maps to a schedulable concept", () => {
  const offered = new Set<ExerciseTypeId>()
  for (const concept of concepts) {
    if (!schedulableConceptIds.includes(concept.id)) continue
    for (const type of exerciseTypesForConcept(concept)) offered.add(type)
  }

  for (const type of offered) {
    const pool = resolveTrainingPool({
      ...DEFAULT_TRAINING_PLAN,
      exerciseTypes: [type],
    })
    assert.ok(pool.length > 0, `no schedulable concept produces ${type}`)
  }

  assert.equal(
    resolveTrainingPool({
      ...DEFAULT_TRAINING_PLAN,
      exerciseTypes: ["translate_phrase"],
    }).length,
    0
  )
})

test("selectNextConcept respects the plan", () => {
  const concept = selectNextConcept(allStates(), null, {
    ...DEFAULT_TRAINING_PLAN,
    chapterIds: ["ch-foundations"],
  })
  assert.equal(BY_ID.get(concept.id)?.chapterId, "ch-foundations")
})

test("planNextQuestion only returns planned concepts", () => {
  const { question } = planNextQuestion(allStates(), 0, null, {
    ...DEFAULT_TRAINING_PLAN,
    exerciseTypes: ["negate_passe_compose"],
  })
  assert.equal(question.conceptId, "pc_negation_basic")
})

test("a contradictory plan falls back to the full pool", () => {
  const { question } = planNextQuestion(allStates(), 0, null, {
    chapterIds: ["does-not-exist"],
    conceptIds: null,
    exerciseTypes: null,
  })
  assert.ok(schedulableConceptIds.includes(question.conceptId))
})
