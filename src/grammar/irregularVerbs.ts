import { AVOIR_FORMS, ETRE_FORMS, type AuxForm } from "./auxVerbs"
import type { IrregularVerb } from "../types/concept"

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

/** Phase 6 — core modal & common irregular verbs (present). */
export const VENIR_FORMS: AuxForm[] = [
  { subject: "je", form: "je viens", verb: "viens" },
  { subject: "tu", form: "tu viens", verb: "viens" },
  { subject: "il", form: "il vient", verb: "vient" },
  { subject: "elle", form: "elle vient", verb: "vient" },
  { subject: "nous", form: "nous venons", verb: "venons" },
  { subject: "vous", form: "vous venez", verb: "venez" },
  { subject: "ils", form: "ils viennent", verb: "viennent" },
  { subject: "elles", form: "elles viennent", verb: "viennent" },
]

export const PRENDRE_FORMS: AuxForm[] = [
  { subject: "je", form: "je prends", verb: "prends" },
  { subject: "tu", form: "tu prends", verb: "prends" },
  { subject: "il", form: "il prend", verb: "prend" },
  { subject: "elle", form: "elle prend", verb: "prend" },
  { subject: "nous", form: "nous prenons", verb: "prenons" },
  { subject: "vous", form: "vous prenez", verb: "prenez" },
  { subject: "ils", form: "ils prennent", verb: "prennent" },
  { subject: "elles", form: "elles prennent", verb: "prennent" },
]

export const POUVOIR_FORMS: AuxForm[] = [
  { subject: "je", form: "je peux", verb: "peux" },
  { subject: "tu", form: "tu peux", verb: "peux" },
  { subject: "il", form: "il peut", verb: "peut" },
  { subject: "elle", form: "elle peut", verb: "peut" },
  { subject: "nous", form: "nous pouvons", verb: "pouvons" },
  { subject: "vous", form: "vous pouvez", verb: "pouvez" },
  { subject: "ils", form: "ils peuvent", verb: "peuvent" },
  { subject: "elles", form: "elles peuvent", verb: "peuvent" },
]

export const VOULOIR_FORMS: AuxForm[] = [
  { subject: "je", form: "je veux", verb: "veux" },
  { subject: "tu", form: "tu veux", verb: "veux" },
  { subject: "il", form: "il veut", verb: "veut" },
  { subject: "elle", form: "elle veut", verb: "veut" },
  { subject: "nous", form: "nous voulons", verb: "voulons" },
  { subject: "vous", form: "vous voulez", verb: "voulez" },
  { subject: "ils", form: "ils veulent", verb: "veulent" },
  { subject: "elles", form: "elles veulent", verb: "veulent" },
]

export const DEVOIR_FORMS: AuxForm[] = [
  { subject: "je", form: "je dois", verb: "dois" },
  { subject: "tu", form: "tu dois", verb: "dois" },
  { subject: "il", form: "il doit", verb: "doit" },
  { subject: "elle", form: "elle doit", verb: "doit" },
  { subject: "nous", form: "nous devons", verb: "devons" },
  { subject: "vous", form: "vous devez", verb: "devez" },
  { subject: "ils", form: "ils doivent", verb: "doivent" },
  { subject: "elles", form: "elles doivent", verb: "doivent" },
]

export const VOIR_FORMS: AuxForm[] = [
  { subject: "je", form: "je vois", verb: "vois" },
  { subject: "tu", form: "tu vois", verb: "vois" },
  { subject: "il", form: "il voit", verb: "voit" },
  { subject: "elle", form: "elle voit", verb: "voit" },
  { subject: "nous", form: "nous voyons", verb: "voyons" },
  { subject: "vous", form: "vous voyez", verb: "voyez" },
  { subject: "ils", form: "ils voient", verb: "voient" },
  { subject: "elles", form: "elles voient", verb: "voient" },
]

export const DIRE_FORMS: AuxForm[] = [
  { subject: "je", form: "je dis", verb: "dis" },
  { subject: "tu", form: "tu dis", verb: "dis" },
  { subject: "il", form: "il dit", verb: "dit" },
  { subject: "elle", form: "elle dit", verb: "dit" },
  { subject: "nous", form: "nous disons", verb: "disons" },
  { subject: "vous", form: "vous dites", verb: "dites" },
  { subject: "ils", form: "ils disent", verb: "disent" },
  { subject: "elles", form: "elles disent", verb: "disent" },
]

export const METTRE_FORMS: AuxForm[] = [
  { subject: "je", form: "je mets", verb: "mets" },
  { subject: "tu", form: "tu mets", verb: "mets" },
  { subject: "il", form: "il met", verb: "met" },
  { subject: "elle", form: "elle met", verb: "met" },
  { subject: "nous", form: "nous mettons", verb: "mettons" },
  { subject: "vous", form: "vous mettez", verb: "mettez" },
  { subject: "ils", form: "ils mettent", verb: "mettent" },
  { subject: "elles", form: "elles mettent", verb: "mettent" },
]

/** Phase 6 — single lookup for the irregular present-tense generator. */
export const IRREGULAR_FORMS: Record<IrregularVerb, AuxForm[]> = {
  etre: ETRE_FORMS,
  avoir: AVOIR_FORMS,
  aller: ALLER_FORMS,
  faire: FAIRE_FORMS,
  venir: VENIR_FORMS,
  prendre: PRENDRE_FORMS,
  pouvoir: POUVOIR_FORMS,
  vouloir: VOULOIR_FORMS,
  devoir: DEVOIR_FORMS,
  voir: VOIR_FORMS,
  dire: DIRE_FORMS,
  mettre: METTRE_FORMS,
}
