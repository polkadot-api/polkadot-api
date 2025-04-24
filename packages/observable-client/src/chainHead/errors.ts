export class BlockNotPinnedError extends Error {
  constructor(hash: string, label: string) {
    super(`Block ${hash} is not pinned (${label})`)
    this.name = "BlockNotPinnedError"
  }
}
