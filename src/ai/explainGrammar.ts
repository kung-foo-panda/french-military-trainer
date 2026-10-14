export type ExplainResponse = {
  explanation: { word: string; meaning: string }[]
}

export async function aiExplain(
  sentence: string
): Promise<ExplainResponse> {
  const response = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence }),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to explain sentence: ${response.status}`
    )
  }

  return response.json()
}
