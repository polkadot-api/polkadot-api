export class DestroyedError extends Error {
  constructor() {
    super("Client destroyed")
    this.name = "DestroyedError"
  }
}
