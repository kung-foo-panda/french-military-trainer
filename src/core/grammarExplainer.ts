export type PhraseExplanation = {
  word: string
  meaning: string
}

export function explainPhrase(
  french: string
): PhraseExplanation[] {
  const dictionary: Record<string, string> = {
    je: "I",
    suis: "am",
    tu: "you",
    es: "are",
    nous: "we",
    sommes: "are",
    "j'ai": "I have",
    as: "have",
    a: "has",
    avons: "have",
    avez: "have",
    ont: "have",
    il: "he",
    elle: "she",
    ils: "they",
    elles: "they",
    vous: "you",
    est: "is",
    sont: "are",
    êtes: "are",
  }

  const words = french.split(" ")

  return words.map((w) => ({
    word: w,
    meaning: dictionary[w] || "?",
  }))
}
