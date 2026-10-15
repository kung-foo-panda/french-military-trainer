import type { EncodedChapter } from "../../ai/encodedConcept"

/**
 * Phase 6 — reviewed encoding of the "core modals & common irregular verbs"
 * chapter (ch 7), produced through the Day-24 AI encoding pipeline. Authored
 * from standard French grammar (provenance `ai`), not the source PDF. Every
 * concept id mirrors an existing runtime concept so the catalog reconciles it.
 */
export const encodedBatch2: EncodedChapter = {
  chapter: 7,
  title: "Core modals & common irregular verbs (present)",
  atomicRules: [
    "pouvoir: peux / peux / peut / pouvons / pouvez / peuvent",
    "vouloir: veux / veux / veut / voulons / voulez / veulent",
    "devoir: dois / dois / doit / devons / devez / doivent",
    "venir: viens / viens / vient / venons / venez / viennent",
    "prendre: prends / prends / prend / prenons / prenez / prennent",
    "voir: vois / vois / voit / voyons / voyez / voient",
    "dire: dis / dis / dit / disons / dites / disent",
    "mettre: mets / mets / met / mettons / mettez / mettent",
  ],
  concepts: [
    {
      id: "present_pouvoir",
      name: "Pouvoir (present)",
      explanation:
        "pouvoir is irregular: je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [
        { french: "je peux", english: ["i can", "i am able to"] },
        { french: "nous pouvons", english: ["we can"] },
      ],
      dependencies: ["present_er_1s"],
      irregular: true,
    },
    {
      id: "present_vouloir",
      name: "Vouloir (present)",
      explanation:
        "vouloir is irregular: je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [
        { french: "je veux", english: ["i want"] },
        { french: "ils veulent", english: ["they want"] },
      ],
      dependencies: ["present_er_1s"],
      irregular: true,
    },
    {
      id: "present_devoir",
      name: "Devoir (present)",
      explanation:
        "devoir is irregular: je dois, tu dois, il doit, nous devons, vous devez, ils doivent.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [
        { french: "je dois", english: ["i must", "i have to"] },
        { french: "nous devons", english: ["we must"] },
      ],
      dependencies: ["present_er_1s"],
      irregular: true,
    },
    {
      id: "present_venir",
      name: "Venir (present)",
      explanation:
        "venir is irregular: je viens, tu viens, il vient, nous venons, vous venez, ils viennent.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [
        { french: "je viens", english: ["i come"] },
        { french: "ils viennent", english: ["they come"] },
      ],
      dependencies: ["present_ir_regular"],
      irregular: true,
    },
    {
      id: "present_prendre",
      name: "Prendre (present)",
      explanation:
        "prendre is irregular: je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [
        { french: "je prends", english: ["i take"] },
        { french: "nous prenons", english: ["we take"] },
      ],
      dependencies: ["present_re_regular"],
      irregular: true,
    },
    {
      id: "present_voir",
      name: "Voir (present)",
      explanation:
        "voir is irregular: je vois, tu vois, il voit, nous voyons, vous voyez, ils voient.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [
        { french: "je vois", english: ["i see"] },
        { french: "nous voyons", english: ["we see"] },
      ],
      dependencies: ["present_er_1s"],
      irregular: true,
    },
    {
      id: "present_dire",
      name: "Dire (present)",
      explanation:
        "dire is irregular: je dis, tu dis, il dit, nous disons, vous dites, ils disent.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [
        { french: "je dis", english: ["i say"] },
        { french: "vous dites", english: ["you say"] },
      ],
      dependencies: ["present_re_regular"],
      irregular: true,
    },
    {
      id: "present_mettre",
      name: "Mettre (present)",
      explanation:
        "mettre is irregular: je mets, tu mets, il met, nous mettons, vous mettez, ils mettent.",
      difficulty: 2,
      category: "irregular present",
      trainable: true,
      examples: [
        { french: "je mets", english: ["i put"] },
        { french: "ils mettent", english: ["they put"] },
      ],
      dependencies: ["present_re_regular"],
      irregular: true,
    },
  ],
  verbIrregularities: [
    {
      verb: "pouvoir",
      group: "irregular",
      forms: {
        "1s": "peux",
        "2s": "peux",
        "3s": "peut",
        "1p": "pouvons",
        "2p": "pouvez",
        "3p": "peuvent",
      },
      participle: "pu",
      auxiliary: "avoir",
    },
    {
      verb: "vouloir",
      group: "irregular",
      forms: {
        "1s": "veux",
        "2s": "veux",
        "3s": "veut",
        "1p": "voulons",
        "2p": "voulez",
        "3p": "veulent",
      },
      participle: "voulu",
      auxiliary: "avoir",
    },
    {
      verb: "devoir",
      group: "irregular",
      forms: {
        "1s": "dois",
        "2s": "dois",
        "3s": "doit",
        "1p": "devons",
        "2p": "devez",
        "3p": "doivent",
      },
      participle: "dû",
      auxiliary: "avoir",
    },
    {
      verb: "venir",
      group: "irregular",
      forms: {
        "1s": "viens",
        "2s": "viens",
        "3s": "vient",
        "1p": "venons",
        "2p": "venez",
        "3p": "viennent",
      },
      participle: "venu",
      auxiliary: "etre",
    },
    {
      verb: "prendre",
      group: "irregular",
      forms: {
        "1s": "prends",
        "2s": "prends",
        "3s": "prend",
        "1p": "prenons",
        "2p": "prenez",
        "3p": "prennent",
      },
      participle: "pris",
      auxiliary: "avoir",
    },
    {
      verb: "voir",
      group: "irregular",
      forms: {
        "1s": "vois",
        "2s": "vois",
        "3s": "voit",
        "1p": "voyons",
        "2p": "voyez",
        "3p": "voient",
      },
      participle: "vu",
      auxiliary: "avoir",
    },
    {
      verb: "dire",
      group: "irregular",
      forms: {
        "1s": "dis",
        "2s": "dis",
        "3s": "dit",
        "1p": "disons",
        "2p": "dites",
        "3p": "disent",
      },
      participle: "dit",
      auxiliary: "avoir",
    },
    {
      verb: "mettre",
      group: "irregular",
      forms: {
        "1s": "mets",
        "2s": "mets",
        "3s": "met",
        "1p": "mettons",
        "2p": "mettez",
        "3p": "mettent",
      },
      participle: "mis",
      auxiliary: "avoir",
    },
  ],
}
