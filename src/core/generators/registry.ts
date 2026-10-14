import { generateRegularQuestion } from "../regularConjugateGenerator"
import { generateIrregularQuestion } from "../irregularConjugateGenerator"
import { generateParticipleQuestion } from "../participleGenerator"
import { generatePasseComposeQuestion } from "../passeComposeGenerator"
import { generateNegationQuestion } from "../negationGenerator"
import { generateDetectionQuestion } from "../detectionGenerator"
import { generateEtreSetQuestion } from "../etreSetGenerator"
import { generateEtreAgreementQuestion } from "../etreAgreementGenerator"
import { generateAuxiliaryIntroQuestion } from "../auxiliaryIntroGenerator"
import { generateFuturProcheQuestion } from "../futurProcheGenerator"
import { generateTranslateQuestion } from "./translate"
import type { GeneratorMap } from "./types"

export const GENERATOR_BY_KIND: GeneratorMap = {
  translate: generateTranslateQuestion,
  conjugate_er: generateRegularQuestion,
  conjugate_ir: generateRegularQuestion,
  conjugate_re: generateRegularQuestion,
  conjugate_regular: generateRegularQuestion,
  conjugate_irregular: generateIrregularQuestion,
  participle_er: generateParticipleQuestion,
  participle_ir_re: generateParticipleQuestion,
  pc_avoir: generatePasseComposeQuestion,
  pc_negation: generateNegationQuestion,
  pc_etre_set: generateEtreSetQuestion,
  pc_etre_agreement: generateEtreAgreementQuestion,
  detect: generateDetectionQuestion,
  auxiliary_intro: generateAuxiliaryIntroQuestion,
  futur_proche: generateFuturProcheQuestion,
}
