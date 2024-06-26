export const mergeUint8 = (inputs: Array<Uint8Array>): Uint8Array => {
  const len = inputs.length
  let totalLen = 0
  for (let i = 0; i < len; i++) totalLen += inputs[i].byteLength
  const result = new Uint8Array(totalLen)

  for (let idx = 0, at = 0; idx < len; idx++) {
    const current = inputs[idx]
    result.set(current, at)
    at += current.byteLength
  }

  return result
}
