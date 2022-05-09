import { fromHex } from "@unstoppablejs/utils"
import { Decoder } from "../types"

class InternalUint8Array extends Uint8Array {
  i: number = 0
  v: DataView

  constructor(buffer: ArrayBuffer) {
    super(buffer)
    this.v = new DataView(buffer)
  }
}

export const toInternalBytes =
  <T>(fn: (input: InternalUint8Array) => T): Decoder<T> =>
  (buffer: string | ArrayBuffer | Uint8Array | InternalUint8Array) =>
    fn(
      buffer instanceof InternalUint8Array
        ? buffer
        : new InternalUint8Array(
            buffer instanceof Uint8Array
              ? buffer.buffer
              : typeof buffer === "string"
              ? fromHex(buffer).buffer
              : buffer,
          ),
    )
