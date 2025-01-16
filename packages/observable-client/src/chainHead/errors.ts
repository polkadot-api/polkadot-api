export class BlockNotPinnedError extends Error {
  constructor(hash: string, label: string) {
    super(`Block ${hash} is not pinned (${label})`)
    this.name = "BlockNotPinnedError"
  }
}

export class BlockPrunedError extends Error {
  constructor() {
    super("Block pruned")
    this.name = "BlockPrunedError"
  }
}

export class NotBestBlockError extends Error {
  constructor() {
    super("Block is not best block or finalized")
    this.name = "NotBestBlockError"
  }
}
