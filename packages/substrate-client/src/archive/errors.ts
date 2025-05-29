export class BlockHashNotFoundError extends Error {
  constructor(hash: string) {
    super(`Invalid BlockHash: ${hash}`)
    this.name = "BlockHashNotFoundError"
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(`Storage Error: ${message}`)
    this.name = "StorageError"
  }
}

export class CallError extends Error {
  constructor(message: string) {
    super(`Call Error: ${message}`)
    this.name = "CallError"
  }
}
