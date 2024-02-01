export class AbortError extends Error {
  constructor() {
    super("Abort Error")
    this.name = "AbortError"
  }
}
