import { Bytes, Decoder, Encoder, createCodec, createDecoder } from "scale-ts"
import { compactNumber } from "./compact"

export interface BitSequence {
  bitsLen: number
  bytes: Uint8Array
}

const bitSequenceDecoder: Decoder<BitSequence> = createDecoder((data) => {
  const bitsLen = compactNumber.dec(data)
  const bytesLen = Math.ceil(bitsLen / 8)
  const bytes = Bytes(bytesLen).dec(data)
  return { bytes, bitsLen }
})

const bitSequenceEncoder: Encoder<BitSequence> = (input) => {
  if (input.bitsLen > input.bytes.length * 8)
    throw new Error(
      `Not enough bits. (bitsLen:${input.bitsLen}, bytesLen:${input.bytes.length})`,
    )

  const lenEncoded = compactNumber.enc(input.bitsLen)
  const result = new Uint8Array(input.bytes.length + lenEncoded.length)
  result.set(lenEncoded, 0)
  result.set(input.bytes, lenEncoded.length)
  return result
}

export const bitSequence = createCodec(bitSequenceEncoder, bitSequenceDecoder)
