/**
 * Day 18 — C19 être auxiliary verb set (movement verbs).
 * Recognition only: no agreement yet.
 */
export const ETRE_VERBS = [
  "aller",
  "venir",
  "arriver",
  "partir",
  "entrer",
  "sortir",
  "monter",
  "descendre",
  "rester",
  "tomber",
  "naître",
  "mourir",
  "retourner",
  "rentrer",
] as const

/** Common avoir verbs used as distractors. */
export const AVOIR_VERBS = [
  "parler",
  "manger",
  "finir",
  "vendre",
  "regarder",
  "attendre",
  "répondre",
  "choisir",
  "trouver",
  "perdre",
] as const

export const AUX_CHOICES = ["être", "avoir"] as const

export const ETRE_VERB_SET: readonly string[] = ETRE_VERBS

/** Day 19 — C20: past participles for the être verb set. */
export const ETRE_PARTICIPLES: Record<string, string> = {
  aller: "allé",
  venir: "venu",
  arriver: "arrivé",
  partir: "parti",
  entrer: "entré",
  sortir: "sorti",
  monter: "monté",
  descendre: "descendu",
  rester: "resté",
  tomber: "tombé",
  naître: "né",
  mourir: "mort",
  retourner: "retourné",
  rentrer: "rentré",
}

