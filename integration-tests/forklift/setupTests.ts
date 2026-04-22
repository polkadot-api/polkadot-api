import { startForklift, stopForklift } from "./src/lib/forklift"

export default async function setupTests() {
  await startForklift()
  return () => stopForklift()
}
