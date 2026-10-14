import type { AuxForm } from "./auxVerbs"

/** Day 26 — present-tense forms for the irregular verbs aller / faire. */
export const ALLER_FORMS: AuxForm[] = [
  { subject: "je", form: "je vais", verb: "vais" },
  { subject: "tu", form: "tu vas", verb: "vas" },
  { subject: "il", form: "il va", verb: "va" },
  { subject: "elle", form: "elle va", verb: "va" },
  { subject: "nous", form: "nous allons", verb: "allons" },
  { subject: "vous", form: "vous allez", verb: "allez" },
  { subject: "ils", form: "ils vont", verb: "vont" },
  { subject: "elles", form: "elles vont", verb: "vont" },
]

export const FAIRE_FORMS: AuxForm[] = [
  { subject: "je", form: "je fais", verb: "fais" },
  { subject: "tu", form: "tu fais", verb: "fais" },
  { subject: "il", form: "il fait", verb: "fait" },
  { subject: "elle", form: "elle fait", verb: "fait" },
  { subject: "nous", form: "nous faisons", verb: "faisons" },
  { subject: "vous", form: "vous faites", verb: "faites" },
  { subject: "ils", form: "ils font", verb: "font" },
  { subject: "elles", form: "elles font", verb: "font" },
]
