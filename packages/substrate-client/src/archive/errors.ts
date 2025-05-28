export class InvalidBlockHashError extends Error {
  constructor(hash: string) {
    super(`Invalid BlockHash: ${hash}`)
    this.name = "InvalidBlockHashError"
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(`Storage Error: ${message}`)
    this.name = "StorageError"
  }
}
