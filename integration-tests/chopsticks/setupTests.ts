import { startForklift, stopForklift } from "./src/chopsticks"

export default async function setupTests() {
  await startForklift()
  return () => stopForklift()
}
