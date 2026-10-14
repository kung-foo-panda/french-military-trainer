import type { Chapter } from "../domain/chapter"
import { source } from "../domain/provenance"

/**
 * Phase 2 — logical content chapters. `number` is a display ordering, not a
 * claim about the source PDF's own chapter numbering (the inventory is not yet
 * verified); `source.ref` names the logical topic instead.
 */
export const chapters: Chapter[] = [
  {
    id: "ch-scaffold",
    number: 0,
    title: "Reference drills (être & avoir person forms)",
    source: source("manual", "scaffold:person-drills"),
  },
  {
    id: "ch-foundations",
    number: 1,
    title: "Foundations: pronouns, person, gender, number",
    source: source("pdf", "book:foundations"),
  },
  {
    id: "ch-irregular-etre-avoir",
    number: 2,
    title: "Irregular verbs: être & avoir (present)",
    source: source("pdf", "book:etre-avoir"),
  },
  {
    id: "ch-present-regular",
    number: 3,
    title: "Regular verbs in the present",
    source: source("pdf", "book:present-regular"),
  },
  {
    id: "ch-aller-faire",
    number: 4,
    title: "Irregular verbs: aller & faire (+ near future)",
    source: source("ai", "batch1:ch4"),
  },
  {
    id: "ch-past-participle",
    number: 5,
    title: "Past participles",
    source: source("pdf", "book:past-participle"),
  },
  {
    id: "ch-passe-compose",
    number: 6,
    title: "Passé composé",
    source: source("pdf", "book:passe-compose"),
  },
]
