import { test } from "node:test"
import assert from "node:assert/strict"
import { evaluateAnswer } from "../src/core/evaluator"
import type { EvalMeta } from "../src/core/evaluator"

test("exact phrase match is correct", () => {
  assert.equal(evaluateAnswer("je parle", ["je parle"]).errorType, "correct")
})

test("verb-only answer is accepted for subject + verb", () => {
  const result = evaluateAnswer("parle", ["je parle"])
  assert.equal(result.correct, true)
  assert.equal(result.errorType, "correct")
})

test("lenient normalization trims and collapses spaces", () => {
  assert.equal(evaluateAnswer("  Je   Parle ", ["je parle"]).correct, true)
})

test("curly apostrophe folds to straight", () => {
  assert.equal(evaluateAnswer("j\u2019ai", ["j'ai"]).correct, true)
})

test("strict mode rejects extra spacing", () => {
  const result = evaluateAnswer("je  parle", ["je parle"], { strict: true })
  assert.equal(result.correct, false)
  assert.equal(result.errorType, "wrong_answer")
})

test("strict mode requires accents", () => {
  const result = evaluateAnswer("parle", ["parl\u00e9"], { strict: true })
  assert.equal(result.correct, false)
})

const CONJUGATE: EvalMeta = {
  mode: "conjugate",
  infinitive: "parler",
  stem: "parl",
  expectedEnding: "e",
  subject: "je",
}

test("conjugate: wrong ending → ending_error", () => {
  assert.equal(
    evaluateAnswer("je parles", ["je parle"], CONJUGATE).errorType,
    "ending_error"
  )
})

test("conjugate: wrong stem → stem_error", () => {
  assert.equal(
    evaluateAnswer("je finis", ["je parle"], CONJUGATE).errorType,
    "stem_error"
  )
})

test("conjugate: correct full phrase", () => {
  assert.equal(
    evaluateAnswer("je parle", ["je parle"], CONJUGATE).errorType,
    "correct"
  )
})

const PARTICIPLE: EvalMeta = {
  mode: "participle",
  infinitive: "parler",
  stem: "parl",
  participle: "parl\u00e9",
}

test("participle: shares stem but wrong → participle_error", () => {
  assert.equal(
    evaluateAnswer("parler", ["parl\u00e9"], PARTICIPLE).errorType,
    "participle_error"
  )
})

test("participle: unrelated answer → wrong_answer", () => {
  assert.equal(
    evaluateAnswer("mang\u00e9", ["parl\u00e9"], PARTICIPLE).errorType,
    "wrong_answer"
  )
})

const PASSE_COMPOSE: EvalMeta = {
  mode: "passe_compose",
  infinitive: "parler",
  subject: "nous",
  auxiliary: "nous avons",
  participle: "parl\u00e9",
}

test("passé composé: wrong participle → participle_error", () => {
  assert.equal(
    evaluateAnswer("nous avons mang\u00e9", ["nous avons parl\u00e9"], PASSE_COMPOSE)
      .errorType,
    "participle_error"
  )
})

test("passé composé: wrong auxiliary → auxiliary_error", () => {
  assert.equal(
    evaluateAnswer("nous sommes parl\u00e9", ["nous avons parl\u00e9"], PASSE_COMPOSE)
      .errorType,
    "auxiliary_error"
  )
})

test("passé composé: both wrong → wrong_answer", () => {
  assert.equal(
    evaluateAnswer("nous sommes mang\u00e9", ["nous avons parl\u00e9"], PASSE_COMPOSE)
      .errorType,
    "wrong_answer"
  )
})

test("mixed_tense reuses the passé composé classifier", () => {
  assert.equal(
    evaluateAnswer("nous sommes parl\u00e9", ["nous avons parl\u00e9"], {
      ...PASSE_COMPOSE,
      mode: "mixed_tense",
    }).errorType,
    "auxiliary_error"
  )
})

test("futur_proche has no classifier → wrong_answer", () => {
  assert.equal(
    evaluateAnswer("je vais mang\u00e9", ["je vais parler"], {
      mode: "futur_proche",
    }).errorType,
    "wrong_answer"
  )
})

const NEGATION: EvalMeta = {
  mode: "negation",
  infinitive: "parler",
  subject: "nous",
  auxiliary: "nous avons",
  participle: "parl\u00e9",
}

test("negation: correct ne + aux + pas + participle", () => {
  assert.equal(
    evaluateAnswer("nous n'avons pas parl\u00e9", ["nous n'avons pas parl\u00e9"], NEGATION)
      .errorType,
    "correct"
  )
})

test("negation: wrong participle → participle_error", () => {
  assert.equal(
    evaluateAnswer("nous n'avons pas mang\u00e9", ["nous n'avons pas parl\u00e9"], NEGATION)
      .errorType,
    "participle_error"
  )
})

test("negation: missing ne/pas → negation_error", () => {
  assert.equal(
    evaluateAnswer("nous avons parl\u00e9", ["nous n'avons pas parl\u00e9"], NEGATION)
      .errorType,
    "negation_error"
  )
})

const ETRE_PC: EvalMeta = {
  mode: "etre_pc",
  infinitive: "aller",
  subject: "elle",
  auxiliary: "est",
  participle: "all\u00e9",
  agreement: "e",
}

test("être passé composé: correct agreement", () => {
  assert.equal(
    evaluateAnswer("elle est all\u00e9e", ["elle est all\u00e9e"], ETRE_PC).errorType,
    "correct"
  )
})

test("être passé composé: missing feminine -e → agreement_error", () => {
  assert.equal(
    evaluateAnswer("elle est all\u00e9", ["elle est all\u00e9e"], ETRE_PC).errorType,
    "agreement_error"
  )
})

test("être passé composé: wrong auxiliary → auxiliary_error", () => {
  assert.equal(
    evaluateAnswer("elle a all\u00e9e", ["elle est all\u00e9e"], ETRE_PC).errorType,
    "auxiliary_error"
  )
})

test("auxiliary mode: correct answer is caught upstream", () => {
  assert.equal(
    evaluateAnswer("\u00eatre", ["\u00eatre"], { mode: "auxiliary", auxiliary: "\u00eatre" })
      .errorType,
    "correct"
  )
})

test("auxiliary mode: any miss → auxiliary_error", () => {
  assert.equal(
    evaluateAnswer("avoir", ["\u00eatre"], { mode: "auxiliary", auxiliary: "\u00eatre" })
      .errorType,
    "auxiliary_error"
  )
})
