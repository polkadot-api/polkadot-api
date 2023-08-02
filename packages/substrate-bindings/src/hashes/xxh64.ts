// Adapted implementation based on: https://github.com/pierrec/js-xxhash/blob/7ff5ced282f97dba121109d7013e0fa80360398c/lib/xxhash64.js

// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.

// helper functions
const bigintFromU16 = (
  v0: number,
  v1: number,
  v2: number,
  v3: number,
): bigint =>
  new DataView(new Uint16Array([v0, v1, v2, v3]).buffer).getBigUint64(0, true)

const MASK_64 = 2n ** 64n - 1n

const rotl = (input: bigint, nBits: bigint) =>
  ((input << nBits) & MASK_64) | (input >> (64n - nBits))

const multiply = (a: bigint, b: bigint) => (a * b) & MASK_64

const add = (a: bigint, b: bigint) => (a + b) & MASK_64

// constants
const PRIME64_1 = 11400714785074694791n
const PRIME64_2 = 14029467366897019727n
const PRIME64_3 = 1609587929392839161n
const PRIME64_4 = 9650029242287828579n
const PRIME64_5 = 2870177450012600261n

export function xxh64(input: Uint8Array, seed: bigint = 0n) {
  let v1 = add(add(seed, PRIME64_1), PRIME64_2)
  let v2 = add(seed, PRIME64_2)
  let v3 = seed
  let v4 = seed - PRIME64_1
  let totalLen = input.length
  let memsize = 0
  let memory: Uint8Array | null = null
  ;(function update() {
    let p = 0
    let bEnd = p + totalLen

    if (!totalLen) return

    memory = new Uint8Array(32)

    if (totalLen < 32) {
      memory.set(input.subarray(0, totalLen), memsize)

      memsize += totalLen
      return
    }

    if (p <= bEnd - 32) {
      const limit = bEnd - 32

      do {
        let other
        other = bigintFromU16(
          (input[p + 1] << 8) | input[p],
          (input[p + 3] << 8) | input[p + 2],
          (input[p + 5] << 8) | input[p + 4],
          (input[p + 7] << 8) | input[p + 6],
        )
        v1 = multiply(rotl(add(v1, multiply(other, PRIME64_2)), 31n), PRIME64_1)
        p += 8
        other = bigintFromU16(
          (input[p + 1] << 8) | input[p],
          (input[p + 3] << 8) | input[p + 2],
          (input[p + 5] << 8) | input[p + 4],
          (input[p + 7] << 8) | input[p + 6],
        )

        v2 = multiply(rotl(add(v2, multiply(other, PRIME64_2)), 31n), PRIME64_1)
        p += 8
        other = bigintFromU16(
          (input[p + 1] << 8) | input[p],
          (input[p + 3] << 8) | input[p + 2],
          (input[p + 5] << 8) | input[p + 4],
          (input[p + 7] << 8) | input[p + 6],
        )

        v3 = multiply(rotl(add(v3, multiply(other, PRIME64_2)), 31n), PRIME64_1)
        p += 8
        other = bigintFromU16(
          (input[p + 1] << 8) | input[p],
          (input[p + 3] << 8) | input[p + 2],
          (input[p + 5] << 8) | input[p + 4],
          (input[p + 7] << 8) | input[p + 6],
        )
        v4 = multiply(rotl(add(v4, multiply(other, PRIME64_2)), 31n), PRIME64_1)
        p += 8
      } while (p <= limit)
    }

    if (p < bEnd) {
      memory.set(input.subarray(p, bEnd), memsize)
      memsize = bEnd - p
    }
  })()

  input = memory || input

  let result: bigint
  let p = 0

  if (totalLen >= 32) {
    result = rotl(v1, 1n)
    result = add(result, rotl(v2, 7n))
    result = add(result, rotl(v3, 12n))
    result = add(result, rotl(v4, 18n))

    v1 = multiply(rotl(multiply(v1, PRIME64_2), 31n), PRIME64_1)
    result = result ^ v1
    result = add(multiply(result, PRIME64_1), PRIME64_4)

    v2 = multiply(rotl(multiply(v2, PRIME64_2), 31n), PRIME64_1)
    result = result ^ v2
    result = add(multiply(result, PRIME64_1), PRIME64_4)

    v3 = multiply(rotl(multiply(v3, PRIME64_2), 31n), PRIME64_1)
    result = result ^ v3
    result = add(multiply(result, PRIME64_1), PRIME64_4)

    v4 = multiply(rotl(multiply(v4, PRIME64_2), 31n), PRIME64_1)
    result = result ^ v4
    result = add(multiply(result, PRIME64_1), PRIME64_4)
  } else {
    result = add(seed, PRIME64_5)
  }

  result = add(result, BigInt(totalLen))

  while (p <= memsize - 8) {
    let temp = bigintFromU16(
      (input[p + 1] << 8) | input[p],
      (input[p + 3] << 8) | input[p + 2],
      (input[p + 5] << 8) | input[p + 4],
      (input[p + 7] << 8) | input[p + 6],
    )
    temp = multiply(rotl(multiply(temp, PRIME64_2), 31n), PRIME64_1)
    result = add(multiply(rotl(result ^ temp, 27n), PRIME64_1), PRIME64_4)
    p += 8
  }

  if (p + 4 <= memsize) {
    let temp = multiply(
      bigintFromU16(
        (input[p + 1] << 8) | input[p],
        (input[p + 3] << 8) | input[p + 2],
        0,
        0,
      ),
      PRIME64_1,
    )

    result = add(multiply(rotl(result ^ temp, 23n), PRIME64_2), PRIME64_3)
    p += 4
  }

  while (p < memsize) {
    const temp = multiply(bigintFromU16(input[p++], 0, 0, 0), PRIME64_5)
    result = multiply(rotl(result ^ temp, 11n), PRIME64_1)
  }

  let temp = result >> 33n
  result = multiply(result ^ temp, PRIME64_2)

  temp = result >> 29n
  result = multiply(result ^ temp, PRIME64_3)

  temp = result >> 32n
  result ^= temp

  return result
}
