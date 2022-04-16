import { fromHex } from "@unstoppablejs/utils"
import { Decoder } from "../types"

class InternalUint8Array extends Uint8Array {
  #usedBytes: number = 0

  useBytes(nBytes: number) {
    this.#usedBytes += nBytes
  }

  get usedBytes() {
    return this.#usedBytes
  }
}

export const toInternalBytes =
  <T>(fn: (input: InternalUint8Array) => T): Decoder<T> =>
  (buffer: string | ArrayBuffer | Uint8Array | InternalUint8Array) =>
    fn(
      buffer instanceof InternalUint8Array
        ? buffer
        : new InternalUint8Array(
            typeof buffer === "string"
              ? fromHex(buffer).buffer
              : buffer instanceof Uint8Array
              ? buffer.buffer
              : buffer,
          ),
    )
