import { test } from "node:test"
import assert from "node:assert/strict"
import { planNextQuestion, selectNextConcept } from "../src/core/sessionEngine"
import { schedulableConceptIds } from "../src/grammar/concepts"
import { createInitialConceptState, type ConceptState } from "../src/types/conceptState"

function statesFor(ids: string[]): ConceptState[] {
  return ids.map((id) => createInitialConceptState(id))
}

function allSchedulableStates(): ConceptState[] {
  return statesFor(schedulableConceptIds)
}

test("pool size is 31 schedulable concepts", () => {
  assert.equal(schedulableConceptIds.length, 31)
})

test("selectNextConcept honours a forced concept id", () => {
  const concept = selectNextConcept(allSchedulableStates(), "present_aller")
  assert.equal(concept.id, "present_aller")
})

test("selectNextConcept throws for unknown ids", () => {
  assert.throws(() =>
    selectNextConcept(allSchedulableStates(), "does_not_exist")
  )
})

test("selectNextConcept returns a schedulable concept", () => {
  const concept = selectNextConcept(allSchedulableStates())
  assert.ok(schedulableConceptIds.includes(concept.id))
})

test("planNextQuestion gives a forced concept priority", () => {
  const { question, weakness } = planNextQuestion(
    allSchedulableStates(),
    0,
    "present_avoir"
  )
  assert.equal(question.conceptId, "present_avoir")
  assert.equal(weakness, false)
})

test("a weakness slot drills the weakest concept", () => {
  const states = allSchedulableStates()
  const target = states.find((s) => s.id === "present_er_1s")
  assert.ok(target)
  target.strength = 5

  const { question, weakness } = planNextQuestion(states, 0)
  assert.equal(weakness, true)
  assert.equal(question.conceptId, "present_er_1s")
})

test("a non-weakness slot does not hunt the weak concept", () => {
  const states = allSchedulableStates()
  const target = states.find((s) => s.id === "present_er_1s")
  assert.ok(target)
  target.strength = 5

  const { question, weakness } = planNextQuestion(states, 2)
  assert.equal(weakness, false)
  assert.notEqual(question.conceptId, "present_er_1s")
})
