import { Binary } from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"

const [preBytes, postBytes] = ["<Bytes>", "</Bytes>"].map((str) =>
  Binary.fromText(str).asBytes(),
)

export const getSignBytes =
  (sign: (x: Uint8Array) => Uint8Array | Promise<Uint8Array>) =>
  async (data: Uint8Array): Promise<Uint8Array> => {
    let isPadded = true
    let i: number

    for (i = 0; isPadded && i < preBytes.length; i++)
      isPadded = preBytes[i] === data[i]
    isPadded = isPadded && i === preBytes.length

    const postDataStart = data.length - postBytes.length
    for (i = 0; isPadded && i < postBytes.length; i++)
      isPadded = postBytes[i] === data[postDataStart + i]
    isPadded = isPadded && i === postBytes.length

    return sign(isPadded ? data : mergeUint8(preBytes, data, postBytes))
  }
