// TODO: deprecate spread overload in papi v2

interface MergeUint8 {
  /**
   * @deprecated This overload will be removed in PAPI v2. Migrate as
   *             follows:
   *             mergeUint8(arr1, arr2) => mergeUint8([arr1, arr2])
   */
  (...inputs: Array<Uint8Array>): Uint8Array
  (inputs: Array<Uint8Array>): Uint8Array
}

export const mergeUint8: MergeUint8 = (...i) => {
  const inputs = (Array.isArray(i[0]) ? i[0] : i) as Uint8Array[]
  const totalLen = inputs.reduce((acc, a) => acc + a.byteLength, 0)
  const result = new Uint8Array(totalLen)

  for (let idx = 0, at = 0; idx < inputs.length; idx++) {
    const current = inputs[idx]
    result.set(current, at)
    at += current.byteLength
  }

  return result
}
