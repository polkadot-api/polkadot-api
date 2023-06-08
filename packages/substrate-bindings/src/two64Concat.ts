import { mergeUint8 } from "@unstoppablejs/utils"
import { Encoder, u64 } from "scale-ts"
import { h64 } from "./h64"

export const two64Concat =
  <T>(encoder: Encoder<T>) =>
  (x: T) => {
    const encoded = encoder(x)
    return mergeUint8(u64.enc(h64(encoded)), encoded)
  }
