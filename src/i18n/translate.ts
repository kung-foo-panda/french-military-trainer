import type { MessageKey, Messages } from "./messages/en"

export type TranslateParams = Record<string, string | number>

/** A locale-bound translation function. */
export type Translate = (key: MessageKey, params?: TranslateParams) => string

const PLACEHOLDER = /\{(\w+)\}/g

/** Replace `{name}` placeholders; unknown placeholders are left untouched. */
export function interpolate(
  template: string,
  params?: TranslateParams
): string {
  if (!params) return template
  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = params[name]
    return value === undefined ? match : String(value)
  })
}

/** Bind a catalogue to a `t()` function (usable from server components too). */
export function createT(messages: Messages): Translate {
  return (key, params) => interpolate(messages[key], params)
}
