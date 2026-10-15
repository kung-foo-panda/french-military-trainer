import { test } from "node:test"
import assert from "node:assert/strict"
import { LOCALES } from "../src/i18n/config"
import { getMessages } from "../src/i18n/messages"
import { en } from "../src/i18n/messages/en"

const PLACEHOLDER = /\{(\w+)\}/g

function placeholders(value: string): string[] {
  return [...value.matchAll(PLACEHOLDER)].map((m) => m[1]).sort()
}

test("every locale defines exactly the English catalogue keys", () => {
  const expected = Object.keys(en).sort()
  for (const locale of LOCALES) {
    const keys = Object.keys(getMessages(locale)).sort()
    assert.deepEqual(
      keys,
      expected,
      `locale ${locale} key set differs from en`
    )
  }
})

test("no catalogue value is empty", () => {
  for (const locale of LOCALES) {
    const messages = getMessages(locale)
    for (const [key, value] of Object.entries(messages)) {
      assert.ok(
        typeof value === "string" && value.trim().length > 0,
        `${locale} ${key} is empty`
      )
    }
  }
})

test("translations keep the English placeholder sets", () => {
  for (const locale of LOCALES) {
    const messages = getMessages(locale)
    for (const [key, value] of Object.entries(en)) {
      assert.deepEqual(
        placeholders(messages[key as keyof typeof en]),
        placeholders(value),
        `${locale} ${key} placeholders differ from en`
      )
    }
  }
})
