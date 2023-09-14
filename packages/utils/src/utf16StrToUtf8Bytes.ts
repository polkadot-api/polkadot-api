export function utf16StrToUtf8Bytes(str: string): Uint8Array {
  const result = []
  for (let i = 0; i < str.length; i++) {
    let currentCode = str.charCodeAt(i)
    if (currentCode < 0x80) result.push(currentCode)
    else if (currentCode < 0x800) {
      result.push(0xc0 | (currentCode >> 6), 0x80 | (currentCode & 0x3f))
    } else if (currentCode > 0xd7ff && currentCode < 0xe000) {
      currentCode =
        0x10000 +
        (((currentCode & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff))
      result.push(
        0xf0 | (currentCode >> 18),
        0x80 | ((currentCode >> 12) & 0x3f),
        0x80 | ((currentCode >> 6) & 0x3f),
        0x80 | (currentCode & 0x3f),
      )
    } else {
      result.push(
        0xe0 | (currentCode >> 12),
        0x80 | ((currentCode >> 6) & 0x3f),
        0x80 | (currentCode & 0x3f),
      )
    }
  }

  return new Uint8Array(result)
}
