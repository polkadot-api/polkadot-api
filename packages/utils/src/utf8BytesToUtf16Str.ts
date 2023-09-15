export function utf8BytesToUtf16Str(input: Uint8Array): string {
  const result: number[] = []

  for (let i = 0; i < input.length; i++) {
    let current = input[i]
    if (current < 0b1000_0000) {
      result.push(current)
    } else if (current < 0b1110_0000) {
      result.push(((current & 0b0011_1111) << 6) | (input[++i] & 0b0011_1111))
    } else if (current <= 0b1110_1110) {
      result.push(
        ((current & 0b0001_1111) << 12) |
          ((input[++i] & 0b0011_1111) << 6) |
          (input[++i] & 0b0011_1111),
      )
    } else {
      const doubleCharCode =
        (((current & 0b0000_1111) << 18) |
          ((input[++i] & 0b0011_1111) << 12) |
          ((input[++i] & 0b0011_1111) << 6) |
          (input[++i] & 0b0011_1111)) -
        0x10000

      result.push((doubleCharCode >> 10) | 0xd800)
      result.push((doubleCharCode & 0b0011_1111_1111) | 0xdc00)
    }
  }

  return String.fromCharCode(...result)
}
