import { mergeUint8 } from "@polkadot-api/utils"
import { Binary, compact, u16 } from "../codecs"
import { Blake2256 } from "../hashes"

const PREFIX = Binary.fromText("modlpy/utilisuba").asBytes()
export const getMultisigAccountId = ({
  threshold,
  signatories,
}: {
  threshold: number
  signatories: Uint8Array[]
}) => {
  const sortedSignatories = signatories.slice().sort((a, b) => {
    for (let i = 0; ; i++) {
      const overA = i >= a.length
      const overB = i >= b.length

      if (overA && overB) return 0
      else if (overA) return -1
      else if (overB) return 1
      else if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1
    }
  })
  const payload = mergeUint8(
    PREFIX,
    compact.enc(sortedSignatories.length),
    ...sortedSignatories,
    u16.enc(threshold),
  )
  return Blake2256(payload)
}
