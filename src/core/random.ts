export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
