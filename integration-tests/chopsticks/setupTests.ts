import { startChopsticks, stopChopsticks } from "./src/chopsticks"

export default async function setupTests() {
  await startChopsticks()
  return () => stopChopsticks()
}
