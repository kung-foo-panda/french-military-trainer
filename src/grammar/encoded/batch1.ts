import type { EncodedChapter } from "../../ai/encodedConcept"

/**
 * Day 25 — reviewed AI encoding batch (Ch 4 "More irregular verbs" + Phase-1
 * backfill). Produced via the Day 24 pipeline, validated, then integrated on
 * Day 26. Not yet schedulable until generators + evaluators exist.
 */
export const encodedBatch1: EncodedChapter = {
  chapter: 4,
  title: "More irregular verbs (+ Phase-1 backfill)",
  atomicRules: [
    "aller: je vais, tu vas, il/elle va, nous allons, vous allez, ils/elles vont",
    "faire: je fais, tu fais, il/elle fait, nous faisons, vous faites, ils/elles font",
    "Near future = aller (present) + infinitive",
    "Regular stems stay constant; only the ending changes",
    "Default passé composé auxiliary is avoir",
  ],
  concepts: [
    {
      id: "present_stem_stability",
      name: "C11 — Stable stems",
      explanation:
        "Keep the stem constant; only the ending changes (parl-, fin-, vend-).",
      difficulty: 1,
      category: "present regular",
      trainable: true,
      examples: [
        { french: "parler → je parle", english: ["i speak"] },
        { french: "finir → je finis", english: ["i finish"] },
        { french: "vendre → je vends", english: ["i sell"] },
      ],
      dependencies: ["present_er_1s"],
      irregular: false,
    },
    {
      id: "auxiliary_selection_intro",
      name: "C14 — Auxiliary default (avoir)",
      explanation:
        "Default auxiliary is avoir; only a small set of verbs take être.",
      difficulty: 1,
      category: "auxiliary",
      trainable: true,
      examples: [
        { french: "j'ai parlé", english: ["i spoke"] },
        { french: "je suis allé", english: ["i went"] },
      ],
      dependencies: ["present_avoir", "present_etre"],
      irregular: false,
    },
    {
      id: "present_aller",
      name: "Aller (present)",
      explanation:
        "aller is irregular: je vais, tu vas, il va, nous allons, vous allez, ils vont.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [{ french: "je vais", english: ["i go"] }],
      dependencies: ["present_ir_regular"],
      irregular: true,
    },
    {
      id: "present_faire",
      name: "Faire (present)",
      explanation:
        "faire is irregular: je fais, tu fais, il fait, nous faisons, vous faites, ils font.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [{ french: "je fais", english: ["i do"] }],
      dependencies: ["present_ir_regular"],
      irregular: true,
    },
    {
      id: "immediate_future",
      name: "Futur proche (aller + infinitif)",
      explanation:
        "Near future = aller (present) + infinitive (je vais parler).",
      difficulty: 2,
      category: "tense",
      trainable: true,
      examples: [{ french: "je vais parler", english: ["i am going to speak"] }],
      dependencies: ["present_aller", "present_er_1s"],
      irregular: false,
    },
  ],
  verbIrregularities: [
    {
      verb: "aller",
      group: "irregular",
      forms: {
        "1s": "vais",
        "2s": "vas",
        "3s": "va",
        "1p": "allons",
        "2p": "allez",
        "3p": "vont",
      },
      participle: "allé",
      auxiliary: "etre",
    },
    {
      verb: "faire",
      group: "irregular",
      forms: {
        "1s": "fais",
        "2s": "fais",
        "3s": "fait",
        "1p": "faisons",
        "2p": "faites",
        "3p": "font",
      },
      participle: "fait",
      auxiliary: "avoir",
    },
  ],
}
