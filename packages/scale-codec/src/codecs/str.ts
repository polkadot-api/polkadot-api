import {
  mergeUint8,
  utf16StrToUtf8Bytes,
  utf8BytesToUtf16Str,
} from "@unstoppablejs/utils"
import { createCodec, Decoder, Encoder } from "../"
import { toInternalBytes } from "../internal"
import { compact } from "./compact"

const strEnc: Encoder<string> = (str) => {
  const val = utf16StrToUtf8Bytes(str)
  return mergeUint8(compact.enc(val.length), val)
}

const strDec: Decoder<string> = toInternalBytes((bytes) => {
  let nElements = compact.dec(bytes) as number
  const arr = new Uint8Array(bytes.buffer, bytes.usedBytes, nElements)
  bytes.useBytes(nElements)
  return utf8BytesToUtf16Str(arr)
})

export const str = createCodec(strEnc, strDec)
