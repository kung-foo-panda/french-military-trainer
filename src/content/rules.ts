import { source } from "../domain/provenance"
import type { Rule } from "../domain/rule"

const pdf = (topic: string) => source("pdf", `book:${topic}`)
const manual = (ref: string) => source("manual", ref)

export const rules: Rule[] = [
  {
    id: "r-scaffold-1",
    chapterId: "ch-scaffold",
    text: "être person forms: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.",
    source: manual("scaffold:person-drills"),
  },
  {
    id: "r-scaffold-2",
    chapterId: "ch-scaffold",
    text: "avoir person forms: j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont.",
    source: manual("scaffold:person-drills"),
  },
  {
    id: "r-found-1",
    chapterId: "ch-foundations",
    text: "Replace a noun subject with the matching subject pronoun (Marie → elle).",
    source: pdf("foundations"),
  },
  {
    id: "r-found-2",
    chapterId: "ch-foundations",
    text: "je = 1s, tu = 2s, il/elle = 3s, nous = 1p, vous = 2p, ils/elles = 3p.",
    source: pdf("foundations"),
  },
  {
    id: "r-present-1",
    chapterId: "ch-present-regular",
    text: "Regular -ER: stem + e / es / e / ons / ez / ent.",
    source: pdf("present-regular"),
  },
  {
    id: "r-present-2",
    chapterId: "ch-present-regular",
    text: "Regular -IR (finir): -is / -is / -it / -issons / -issez / -issent.",
    source: pdf("present-regular"),
  },
  {
    id: "r-present-3",
    chapterId: "ch-present-regular",
    text: "Regular -RE (vendre): -s / -s / - / -ons / -ez / -ent.",
    source: pdf("present-regular"),
  },
  {
    id: "r-present-4",
    chapterId: "ch-present-regular",
    text: "Only the ending changes; the stem stays constant (parl-, fin-, vend-).",
    source: pdf("present-regular"),
  },
  {
    id: "r-etre-avoir-1",
    chapterId: "ch-irregular-etre-avoir",
    text: "être: suis / es / est / sommes / êtes / sont.",
    source: pdf("etre-avoir"),
  },
  {
    id: "r-etre-avoir-2",
    chapterId: "ch-irregular-etre-avoir",
    text: "avoir: ai / as / a / avons / avez / ont.",
    source: pdf("etre-avoir"),
  },
  {
    id: "r-aller-faire-1",
    chapterId: "ch-aller-faire",
    text: "aller: vais / vas / va / allons / allez / vont.",
    source: source("ai", "batch1:ch4"),
  },
  {
    id: "r-aller-faire-2",
    chapterId: "ch-aller-faire",
    text: "faire: fais / fais / fait / faisons / faites / font.",
    source: source("ai", "batch1:ch4"),
  },
  {
    id: "r-aller-faire-3",
    chapterId: "ch-aller-faire",
    text: "Near future = aller (present) + infinitive (je vais parler).",
    source: source("ai", "batch1:ch4"),
  },
  {
    id: "r-pp-1",
    chapterId: "ch-past-participle",
    text: "Regular -ER participles end in -é (parler → parlé).",
    source: pdf("past-participle"),
  },
  {
    id: "r-pp-2",
    chapterId: "ch-past-participle",
    text: "Regular -IR → -i (fini); -RE → -u (vendu).",
    source: pdf("past-participle"),
  },
  {
    id: "r-pc-1",
    chapterId: "ch-passe-compose",
    text: "Passé composé = subject + auxiliary + past participle.",
    source: pdf("passe-compose"),
  },
  {
    id: "r-pc-2",
    chapterId: "ch-passe-compose",
    text: "Negation: ne + auxiliary + pas + past participle.",
    source: pdf("passe-compose"),
  },
  {
    id: "r-pc-3",
    chapterId: "ch-passe-compose",
    text: "The default auxiliary is avoir; only a small set of verbs take être.",
    source: pdf("passe-compose"),
  },
  {
    id: "r-pc-4",
    chapterId: "ch-passe-compose",
    text: "Movement verbs (aller, venir, partir…) take être.",
    source: pdf("passe-compose"),
  },
  {
    id: "r-pc-5",
    chapterId: "ch-passe-compose",
    text: "With être the participle agrees with the subject (elle est allée).",
    source: pdf("passe-compose"),
  },
  {
    id: "r-irr-common-1",
    chapterId: "ch-irregular-common",
    text: "pouvoir: peux / peux / peut / pouvons / pouvez / peuvent.",
    source: source("ai", "batch2:ch7"),
  },
  {
    id: "r-irr-common-2",
    chapterId: "ch-irregular-common",
    text: "vouloir: veux / veux / veut / voulons / voulez / veulent.",
    source: source("ai", "batch2:ch7"),
  },
  {
    id: "r-irr-common-3",
    chapterId: "ch-irregular-common",
    text: "devoir: dois / dois / doit / devons / devez / doivent.",
    source: source("ai", "batch2:ch7"),
  },
  {
    id: "r-irr-common-4",
    chapterId: "ch-irregular-common",
    text: "venir: viens / viens / vient / venons / venez / viennent.",
    source: source("ai", "batch2:ch7"),
  },
  {
    id: "r-irr-common-5",
    chapterId: "ch-irregular-common",
    text: "prendre: prends / prends / prend / prenons / prenez / prennent.",
    source: source("ai", "batch2:ch7"),
  },
  {
    id: "r-irr-common-6",
    chapterId: "ch-irregular-common",
    text: "voir: vois / vois / voit / voyons / voyez / voient.",
    source: source("ai", "batch2:ch7"),
  },
  {
    id: "r-irr-common-7",
    chapterId: "ch-irregular-common",
    text: "dire: dis / dis / dit / disons / dites / disent (note: vous dites).",
    source: source("ai", "batch2:ch7"),
  },
  {
    id: "r-irr-common-8",
    chapterId: "ch-irregular-common",
    text: "mettre: mets / mets / met / mettons / mettez / mettent.",
    source: source("ai", "batch2:ch7"),
  },
]
