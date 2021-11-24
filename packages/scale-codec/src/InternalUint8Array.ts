export class InternalUint8Array extends Uint8Array {
  #usedBytes: number = 0

  useBytes(nBytes: number) {
    this.#usedBytes += nBytes
  }

  get usedBytes() {
    return this.#usedBytes
  }
}
