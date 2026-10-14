export type AuxSubject =
  | "je"
  | "tu"
  | "il"
  | "elle"
  | "nous"
  | "vous"
  | "ils"
  | "elles"

export type AuxForm = {
  subject: AuxSubject
  /** Full form including subject (e.g. "nous avons") */
  form: string
  /** Verb part without subject (e.g. "avons"); used to build negation */
  verb: string
}

export const ETRE_FORMS: AuxForm[] = [
  { subject: "je", form: "je suis", verb: "suis" },
  { subject: "tu", form: "tu es", verb: "es" },
  { subject: "il", form: "il est", verb: "est" },
  { subject: "elle", form: "elle est", verb: "est" },
  { subject: "nous", form: "nous sommes", verb: "sommes" },
  { subject: "vous", form: "vous êtes", verb: "êtes" },
  { subject: "ils", form: "ils sont", verb: "sont" },
  { subject: "elles", form: "elles sont", verb: "sont" },
]

export const AVOIR_FORMS: AuxForm[] = [
  { subject: "je", form: "j'ai", verb: "ai" },
  { subject: "tu", form: "tu as", verb: "as" },
  { subject: "il", form: "il a", verb: "a" },
  { subject: "elle", form: "elle a", verb: "a" },
  { subject: "nous", form: "nous avons", verb: "avons" },
  { subject: "vous", form: "vous avez", verb: "avez" },
  { subject: "ils", form: "ils ont", verb: "ont" },
  { subject: "elles", form: "elles ont", verb: "ont" },
]
