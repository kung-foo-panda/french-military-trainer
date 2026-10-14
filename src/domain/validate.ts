import type { Catalog } from "./concept"
import { isSourceRef } from "./provenance"

export type CatalogValidation = {
  ok: boolean
  errors: string[]
}

export function duplicateIds(ids: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id)
    seen.add(id)
  }
  return [...duplicates]
}

/** Structural validation: unique ids, resolvable references, provenance. */
export function validateCatalog(catalog: Catalog): CatalogValidation {
  const errors: string[] = []

  const groups: [string, string[]][] = [
    ["chapter", catalog.chapters.map((c) => c.id)],
    ["rule", catalog.rules.map((r) => r.id)],
    ["example", catalog.examples.map((e) => e.id)],
    ["concept", catalog.concepts.map((c) => c.id)],
  ]
  for (const [label, ids] of groups) {
    for (const id of duplicateIds(ids)) {
      errors.push(`duplicate ${label} id: ${id}`)
    }
  }

  const chapterIds = new Set(catalog.chapters.map((c) => c.id))
  const ruleIds = new Set(catalog.rules.map((r) => r.id))
  const exampleIds = new Set(catalog.examples.map((e) => e.id))
  const conceptIds = new Set(catalog.concepts.map((c) => c.id))

  for (const chapter of catalog.chapters) {
    if (!isSourceRef(chapter.source)) errors.push(`chapter ${chapter.id}: bad source`)
  }

  for (const rule of catalog.rules) {
    if (!chapterIds.has(rule.chapterId)) {
      errors.push(`rule ${rule.id}: unknown chapter ${rule.chapterId}`)
    }
    if (!isSourceRef(rule.source)) errors.push(`rule ${rule.id}: bad source`)
  }

  for (const example of catalog.examples) {
    if (!conceptIds.has(example.conceptId)) {
      errors.push(`example ${example.id}: unknown concept ${example.conceptId}`)
    }
    if (!isSourceRef(example.source)) errors.push(`example ${example.id}: bad source`)
  }

  for (const concept of catalog.concepts) {
    if (!chapterIds.has(concept.chapterId)) {
      errors.push(`concept ${concept.id}: unknown chapter ${concept.chapterId}`)
    }
    for (const ruleId of concept.ruleIds) {
      if (!ruleIds.has(ruleId)) {
        errors.push(`concept ${concept.id}: unknown rule ${ruleId}`)
      }
    }
    for (const exampleId of concept.exampleIds) {
      if (!exampleIds.has(exampleId)) {
        errors.push(`concept ${concept.id}: unknown example ${exampleId}`)
      }
    }
    if (!isSourceRef(concept.source)) {
      errors.push(`concept ${concept.id}: bad source`)
    }
    if (concept.runtime && concept.exerciseTypes.length === 0) {
      errors.push(`concept ${concept.id}: no exercise types`)
    }
  }

  return { ok: errors.length === 0, errors }
}
