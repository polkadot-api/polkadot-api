export class BlockHashNotFoundError extends Error {
  static errorName = "BlockHashNotFoundError"

  constructor(hash: string) {
    super(`Invalid BlockHash: ${hash}`)
    this.name = BlockHashNotFoundError.errorName
  }
}

export class StorageError extends Error {
  static errorName = "StorageError"

  constructor(message: string) {
    super(`Storage Error: ${message}`)
    this.name = StorageError.errorName
  }
}

export class CallError extends Error {
  static errorName = "CallError"

  constructor(message: string) {
    super(`Call Error: ${message}`)
    this.name = CallError.errorName
  }
}
