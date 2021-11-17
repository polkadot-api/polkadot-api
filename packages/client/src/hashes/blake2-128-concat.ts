import { blake2b } from "noble-hashes/lib/blake2b"

export const blakeTwo128Concat = (input: Uint8Array): Uint8Array => {
  const blakeResult = blake2b(input, { dkLen: 16 })
  const result = new Uint8Array(input.length + 16)
  result.set(blakeResult, 0)
  result.set(input, 16)
  return result
}
