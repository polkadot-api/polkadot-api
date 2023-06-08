// Original source code: https://github.com/cryptocoinjs/base-x/blob/4c10d3313a5838ce122ca3022823f1b4b153b843/src/index.js

// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

const BASE_MAP = new Uint8Array(256)
for (let j = 0; j < BASE_MAP.length; j++) {
  BASE_MAP[j] = 255
}
for (let i = 0; i < alphabet.length; i++) {
  const x = alphabet.charAt(i)
  const xc = x.charCodeAt(0)
  if (BASE_MAP[xc] !== 255) {
    throw new TypeError(x + " is ambiguous")
  }
  BASE_MAP[xc] = i
}

const FACTOR = Math.log(58) / Math.log(256)
const iFACTOR = Math.log(256) / Math.log(58)
export function encodeBase58(source: Uint8Array) {
  // Skip & count leading zeroes.
  let zeroes = 0
  let length = 0
  let pbegin = 0
  const pend = source.length
  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++
    zeroes++
  }
  // Allocate enough space in big-endian base58 representation.
  const size = ((pend - pbegin) * iFACTOR + 1) >>> 0
  const b58 = new Uint8Array(size)
  // Process the bytes.
  while (pbegin !== pend) {
    let carry = source[pbegin]
    // Apply "b58 = b58 * 256 + ch".
    let i = 0
    for (
      let it1 = size - 1;
      (carry !== 0 || i < length) && it1 !== -1;
      it1--, i++
    ) {
      carry += (256 * b58[it1]) >>> 0
      b58[it1] = carry % 58 >>> 0
      carry = (carry / 58) >>> 0
    }
    if (carry !== 0) {
      throw new Error("Non-zero carry")
    }
    length = i
    pbegin++
  }
  // Skip leading zeroes in base58 result.
  let it2 = size - length
  while (it2 !== size && b58[it2] === 0) {
    it2++
  }
  // Translate the result into a string.
  let str = alphabet.charAt(0).repeat(zeroes)
  for (; it2 < size; ++it2) {
    str += alphabet.charAt(b58[it2])
  }
  return str
}

export function decodeBase58(source: string): Buffer {
  let psz = 0
  // Skip and count leading '1's.
  let zeroes = 0
  let length = 0
  while (source[psz] === alphabet.charAt(0)) {
    zeroes++
    psz++
  }
  // Allocate enough space in big-endian base256 representation.
  const size = ((source.length - psz) * FACTOR + 1) >>> 0 // log(58) / log(256), rounded up.
  const b256 = new Uint8Array(size)
  // Process the characters.
  while (source[psz]) {
    // Decode character
    let carry = BASE_MAP[source.charCodeAt(psz)]
    // Invalid character
    if (carry === 255) {
      throw new Error("Invalid character!")
    }
    let i = 0
    for (
      let it3 = size - 1;
      (carry !== 0 || i < length) && it3 !== -1;
      it3--, i++
    ) {
      carry += (58 * b256[it3]) >>> 0
      b256[it3] = carry % 256 >>> 0
      carry = (carry / 256) >>> 0
    }
    if (carry !== 0) {
      throw new Error("Non-zero carry")
    }
    length = i
    psz++
  }
  // Skip leading zeroes in b256.
  let it4 = size - length
  while (it4 !== size && b256[it4] === 0) {
    it4++
  }
  const vch = Buffer.allocUnsafe(zeroes + (size - it4))
  vch.fill(0x00, 0, zeroes)
  let j = zeroes
  while (it4 !== size) {
    vch[j++] = b256[it4++]
  }
  return vch
}
