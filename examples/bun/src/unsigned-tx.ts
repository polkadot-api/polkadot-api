import { mergeUint8 } from "polkadot-api/utils"
import { Binary, compactNumber } from "@polkadot-api/substrate-bindings"
import { type Transaction } from "polkadot-api"

const unsigedTxFromCallData = (callData: Binary): Binary => {
  const rawCallData = callData.asBytes()
  return Binary.fromBytes(
    mergeUint8(
      compactNumber.enc(rawCallData.length + 1),
      new Uint8Array([4]),
      rawCallData,
    ),
  )
}

const txToUnsigedTx = async (tx: Transaction<any, any, any, any>) =>
  unsigedTxFromCallData(await tx.getEncodedData())
