interface MergeUint8 {
  (inputs: Array<Uint8Array>): Uint8Array
}

export const mergeUint8: MergeUint8 = (inputs) => {
  const totalLen = inputs.reduce((acc, a) => acc + a.byteLength, 0)
  const result = new Uint8Array(totalLen)

  for (let idx = 0, at = 0; idx < inputs.length; idx++) {
    const current = inputs[idx]
    result.set(current, at)
    at += current.byteLength
  }

  return result
}
