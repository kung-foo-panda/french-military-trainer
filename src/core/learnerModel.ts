/**
 * Shared simulated learner used by the Day 28 stress harness and the Day 29
 * tuning study. Deterministic in the seed so runs are reproducible.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

/**
 * Simulated learner: more strength → more accurate and faster, minus fatigue.
 * `fatigueIndex` grows across a day's sessions. `stability` adds a spacing
 * bonus (consolidated items are recalled better).
 */
export function simulateAnswer(
  strength: number,
  fatigueIndex: number,
  rand: () => number,
  stability = 0
): { correct: boolean; ms: number } {
  const spacing = Math.min(0.15, stability * 0.015)
  const pCorrect = Math.min(
    0.98,
    Math.max(0.3, 0.3 + (strength / 100) * 0.65 + spacing)
  )
  const correct = rand() < pCorrect
  const fatigue = 1 + 0.15 * fatigueIndex
  const jitter = 0.8 + rand() * 0.4
  const ms = Math.round(6000 * (1.6 - strength / 125) * fatigue * jitter)
  return { correct, ms }
}
