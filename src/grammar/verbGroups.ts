/**
 * Day 16 — unified regular verb groups (-ER / -IR / -RE).
 * One config shape drives conjugation and (later) participle logic.
 */
export type VerbGroup = "er" | "ir" | "re"

export type Person6 = "1s" | "2s" | "3s" | "1p" | "2p" | "3p"

export type PersonForm = {
  subject: string
  ending: string
}

export type VerbGroupConfig = {
  group: VerbGroup
  verbs: readonly string[]
  stem: (infinitive: string) => string
  participleEnding: string
  forms: Record<Person6, PersonForm[]>
}

function stemBySuffix(suffix: string) {
  return (infinitive: string): string => {
    if (!infinitive.endsWith(suffix)) {
      throw new Error(`Verb does not end in -${suffix}: ${infinitive}`)
    }
    return infinitive.slice(0, -suffix.length)
  }
}

export const VERB_GROUPS: Record<VerbGroup, VerbGroupConfig> = {
  er: {
    group: "er",
    verbs: [
      "parler",
      "aimer",
      "regarder",
      "écouter",
      "travailler",
      "marcher",
      "demander",
      "trouver",
      "donner",
      "arriver",
    ],
    stem: stemBySuffix("er"),
    participleEnding: "é",
    forms: {
      "1s": [{ subject: "je", ending: "e" }],
      "2s": [{ subject: "tu", ending: "es" }],
      "3s": [
        { subject: "il", ending: "e" },
        { subject: "elle", ending: "e" },
      ],
      "1p": [{ subject: "nous", ending: "ons" }],
      "2p": [{ subject: "vous", ending: "ez" }],
      "3p": [
        { subject: "ils", ending: "ent" },
        { subject: "elles", ending: "ent" },
      ],
    },
  },
  ir: {
    group: "ir",
    verbs: [
      "finir",
      "choisir",
      "réussir",
      "grandir",
      "réfléchir",
      "remplir",
      "obéir",
      "bâtir",
    ],
    stem: stemBySuffix("ir"),
    participleEnding: "i",
    forms: {
      "1s": [{ subject: "je", ending: "is" }],
      "2s": [{ subject: "tu", ending: "is" }],
      "3s": [
        { subject: "il", ending: "it" },
        { subject: "elle", ending: "it" },
      ],
      "1p": [{ subject: "nous", ending: "issons" }],
      "2p": [{ subject: "vous", ending: "issez" }],
      "3p": [
        { subject: "ils", ending: "issent" },
        { subject: "elles", ending: "issent" },
      ],
    },
  },
  re: {
    group: "re",
    verbs: [
      "vendre",
      "attendre",
      "répondre",
      "perdre",
      "entendre",
      "descendre",
      "rendre",
      "fondre",
    ],
    stem: stemBySuffix("re"),
    participleEnding: "u",
    forms: {
      "1s": [{ subject: "je", ending: "s" }],
      "2s": [{ subject: "tu", ending: "s" }],
      "3s": [
        { subject: "il", ending: "" },
        { subject: "elle", ending: "" },
      ],
      "1p": [{ subject: "nous", ending: "ons" }],
      "2p": [{ subject: "vous", ending: "ez" }],
      "3p": [
        { subject: "ils", ending: "ent" },
        { subject: "elles", ending: "ent" },
      ],
    },
  },
}
