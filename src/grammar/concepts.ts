import { source } from "../domain/provenance"
import { Concept } from "../types/concept"

export const concepts: Concept[] = [
  // —— Être (person-level, legacy) — kept for manual practice only ——
  {
    id: "etre_1s",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Être — je",
    explanation: "je suis",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [{ french: "je suis", english: ["i am"] }],
  },
  {
    id: "etre_2s",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Être — tu",
    explanation: "tu es",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [{ french: "tu es", english: ["you are"] }],
  },
  {
    id: "etre_3s",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Être — il/elle",
    explanation: "il/elle est",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [
      { french: "il est", english: ["he is"] },
      { french: "elle est", english: ["she is"] },
    ],
  },
  {
    id: "etre_1p",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Être — nous",
    explanation: "nous sommes",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [{ french: "nous sommes", english: ["we are"] }],
  },
  {
    id: "etre_2p",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Être — vous",
    explanation: "vous êtes",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [{ french: "vous êtes", english: ["you are"] }],
  },
  {
    id: "etre_3p",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Être — ils/elles",
    explanation: "ils/elles sont",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [
      { french: "ils sont", english: ["they are"] },
      { french: "elles sont", english: ["they are"] },
    ],
  },

  // —— Avoir (person-level, legacy) — kept for manual practice only ——
  {
    id: "avoir_1s",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Avoir — je",
    explanation: "j'ai",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [{ french: "j'ai", english: ["i have"] }],
  },
  {
    id: "avoir_2s",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Avoir — tu",
    explanation: "tu as",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [{ french: "tu as", english: ["you have"] }],
  },
  {
    id: "avoir_3s",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Avoir — il/elle",
    explanation: "il/elle a",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [
      { french: "il a", english: ["he has"] },
      { french: "elle a", english: ["she has"] },
    ],
  },
  {
    id: "avoir_1p",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Avoir — nous",
    explanation: "nous avons",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [{ french: "nous avons", english: ["we have"] }],
  },
  {
    id: "avoir_2p",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Avoir — vous",
    explanation: "vous avez",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [{ french: "vous avez", english: ["you have"] }],
  },
  {
    id: "avoir_3p",
    chapterId: "ch-scaffold",
    source: source("manual", "scaffold:person-drills"),
    name: "Avoir — ils/elles",
    explanation: "ils/elles ont",
    difficulty: 1,
    kind: "translate",
    schedulable: false,
    examples: [
      { french: "ils ont", english: ["they have"] },
      { french: "elles ont", english: ["they have"] },
    ],
  },

  // —— Day 15: C1–C4 subject / gender / plural detection ——
  {
    id: "subj_pronouns_core",
    chapterId: "ch-foundations",
    source: source("pdf", "book:foundations"),
    name: "C1 — Subject pronouns",
    explanation: "Replace a noun subject with the right pronoun (Marie → elle).",
    difficulty: 1,
    kind: "detect",
    variant: "pronoun",
  },
  {
    id: "subject_person_index",
    chapterId: "ch-foundations",
    source: source("pdf", "book:foundations"),
    name: "C2 — Person index",
    explanation: "je = 1s, tu = 2s, il/elle = 3s, nous = 1p, vous = 2p, ils/elles = 3p.",
    difficulty: 1,
    kind: "detect",
    variant: "person",
  },
  {
    id: "plural_detection",
    chapterId: "ch-foundations",
    source: source("pdf", "book:foundations"),
    name: "C3 — Plural detection",
    explanation: "Decide whether a subject is singular or plural.",
    difficulty: 1,
    kind: "detect",
    variant: "plural",
  },
  {
    id: "gender_detection_basic",
    chapterId: "ch-foundations",
    source: source("pdf", "book:foundations"),
    name: "C4 — Gender detection",
    explanation: "Recognize whether a noun is masculine or feminine.",
    difficulty: 1,
    kind: "detect",
    variant: "gender",
  },

  // —— Day 5: C5–C8 regular -ER present ——
  {
    id: "present_er_1s",
    chapterId: "ch-present-regular",
    source: source("pdf", "book:present-regular"),
    name: "-ER present — je (-e)",
    explanation: "Regular -ER verbs: je + stem + e",
    difficulty: 1,
    kind: "conjugate_er",
    slot: "1s",
  },
  {
    id: "present_er_2s",
    chapterId: "ch-present-regular",
    source: source("pdf", "book:present-regular"),
    name: "-ER present — tu (-es)",
    explanation: "Regular -ER verbs: tu + stem + es",
    difficulty: 1,
    kind: "conjugate_er",
    slot: "2s",
  },
  {
    id: "present_er_3s",
    chapterId: "ch-present-regular",
    source: source("pdf", "book:present-regular"),
    name: "-ER present — il/elle (-e)",
    explanation: "Regular -ER verbs: il/elle + stem + e",
    difficulty: 1,
    kind: "conjugate_er",
    slot: "3s",
  },
  {
    id: "present_er_plural",
    chapterId: "ch-present-regular",
    source: source("pdf", "book:present-regular"),
    name: "-ER present — plural (-ons/-ez/-ent)",
    explanation: "Regular -ER: nous -ons, vous -ez, ils/elles -ent",
    difficulty: 1,
    kind: "conjugate_er",
    slot: "plural",
  },

  // —— Day 16: C9 + C10 regular -IR / -RE present ——
  {
    id: "present_ir_regular",
    chapterId: "ch-present-regular",
    source: source("pdf", "book:present-regular"),
    name: "C9 — -IR present (finir)",
    explanation: "Regular -IR verbs: -is/-is/-it/-issons/-issez/-issent (finir → je finis).",
    difficulty: 2,
    kind: "conjugate_ir",
  },
  {
    id: "present_re_regular",
    chapterId: "ch-present-regular",
    source: source("pdf", "book:present-regular"),
    name: "C10 — -RE present (vendre)",
    explanation: "Regular -RE verbs: -s/-s/-/-ons/-ez/-ent (vendre → il vend).",
    difficulty: 2,
    kind: "conjugate_re",
  },

  // —— Day 26: C11 stem stability (all regular groups) ——
  {
    id: "present_stem_stability",
    chapterId: "ch-present-regular",
    source: source("pdf", "book:present-regular"),
    name: "C11 — Stems stables",
    explanation:
      "Keep the stem constant (parl-, fin-, vend-); only the ending changes.",
    difficulty: 2,
    kind: "conjugate_regular",
  },

  // —— Day 8: C12 + C13 irregular present (être & avoir) ——
  {
    id: "present_etre",
    chapterId: "ch-irregular-etre-avoir",
    source: source("pdf", "book:etre-avoir"),
    name: "C12 — Être (present)",
    explanation: "All forms of être must be memorized.",
    difficulty: 1,
    kind: "conjugate_irregular",
    verb: "etre",
  },
  {
    id: "present_avoir",
    chapterId: "ch-irregular-etre-avoir",
    source: source("pdf", "book:etre-avoir"),
    name: "C13 — Avoir (present)",
    explanation: "Avoir present tense — critical foundation.",
    difficulty: 1,
    kind: "conjugate_irregular",
    verb: "avoir",
  },

  // —— Day 26: C14 default auxiliary (avoir) ——
  {
    id: "auxiliary_selection_intro",
    chapterId: "ch-passe-compose",
    source: source("pdf", "book:passe-compose"),
    name: "C14 — Auxiliaire par défaut (avoir)",
    explanation: "Default auxiliary is avoir; only a few verbs take être.",
    difficulty: 1,
    kind: "auxiliary_intro",
  },

  // —— Day 9: C15 past participle (-ER) ——
  {
    id: "pp_er_regular",
    chapterId: "ch-past-participle",
    source: source("pdf", "book:past-participle"),
    name: "C15 — Participe passé (-ER)",
    explanation: "Regular -ER verbs: drop -er, add -é (parler → parlé).",
    difficulty: 1,
    kind: "participle_er",
  },

  // —— Day 17: C16 past participle (-IR / -RE) ——
  {
    id: "pp_ir_re_regular",
    chapterId: "ch-past-participle",
    source: source("pdf", "book:past-participle"),
    name: "C16 — Participe passé (-IR / -RE)",
    explanation: "Regular -IR verbs → -i (finir → fini); -RE verbs → -u (vendre → vendu).",
    difficulty: 2,
    kind: "participle_ir_re",
  },

  // —— Day 10: C17 passé composé (avoir) structure ——
  {
    id: "pc_structure_avoir",
    chapterId: "ch-passe-compose",
    source: source("pdf", "book:passe-compose"),
    name: "C17 — Passé composé (avoir)",
    explanation: "subject + avoir + past participle (nous avons parlé).",
    difficulty: 2,
    kind: "pc_avoir",
  },

  // —— Day 11: C18 negative passé composé ——
  {
    id: "pc_negation_basic",
    chapterId: "ch-passe-compose",
    source: source("pdf", "book:passe-compose"),
    name: "C18 — Négation (passé composé)",
    explanation: "ne + avoir + pas + participle (nous n'avons pas parlé).",
    difficulty: 2,
    kind: "pc_negation",
  },

  // —— Day 18: C19 être auxiliary verb set (recognition) ——
  {
    id: "pc_etre_verb_set",
    chapterId: "ch-passe-compose",
    source: source("pdf", "book:passe-compose"),
    name: "C19 — Auxiliaire être (verbes de mouvement)",
    explanation: "Movement verbs take être (aller, venir, partir…); others take avoir.",
    difficulty: 2,
    kind: "pc_etre_set",
  },

  // —— Day 19: C20 être agreement (singular) ——
  {
    id: "pc_etre_agreement_singular",
    chapterId: "ch-passe-compose",
    source: source("pdf", "book:passe-compose"),
    name: "C20 — Accord avec être (singulier)",
    explanation: "With être, the participle agrees: feminine singular adds -e (elle est allée).",
    difficulty: 2,
    kind: "pc_etre_agreement",
  },

  // —— Day 26: new concepts from Ch 4 (aller / faire / futur proche) ——
  {
    id: "present_aller",
    chapterId: "ch-aller-faire",
    source: source("ai", "batch1:ch4"),
    name: "Aller (présent)",
    explanation:
      "aller: je vais, tu vas, il va, nous allons, vous allez, ils vont.",
    difficulty: 2,
    kind: "conjugate_irregular",
    verb: "aller",
  },
  {
    id: "present_faire",
    chapterId: "ch-aller-faire",
    source: source("ai", "batch1:ch4"),
    name: "Faire (présent)",
    explanation:
      "faire: je fais, tu fais, il fait, nous faisons, vous faites, ils font.",
    difficulty: 2,
    kind: "conjugate_irregular",
    verb: "faire",
  },
  {
    id: "immediate_future",
    chapterId: "ch-aller-faire",
    source: source("ai", "batch1:ch4"),
    name: "Futur proche (aller + infinitif)",
    explanation: "Near future = aller (present) + infinitive (je vais parler).",
    difficulty: 2,
    kind: "futur_proche",
  },
]

/** Day 12: the mixed-session pool (excludes schedulable: false). */
export const schedulableConcepts: Concept[] = concepts.filter(
  (c) => c.schedulable !== false
)

export const schedulableConceptIds: string[] = schedulableConcepts.map(
  (c) => c.id
)
