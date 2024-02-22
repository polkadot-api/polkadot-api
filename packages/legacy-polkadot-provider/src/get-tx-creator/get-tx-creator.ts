import { createClient } from "@polkadot-api/substrate-client"
import { getObservableClient } from "@polkadot-api/client"
import {
  filter,
  firstValueFrom,
  map,
  mergeMap,
  take,
  withLatestFrom,
} from "rxjs"
import { _void, compact } from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8 } from "@polkadot-api/utils"

import type { CreateTx, GetTxCreator } from "@/types/internal-types"
import { getRelevantSignedExtensions } from "./get-relevant-signed-extensions"
import { multiAddressEncoder } from "./multi-address-encoder"
import { getTxData } from "./get-tx-data"
import { versionBytes } from "./version-bytes"
import { SignerPayloadJSON } from "@/types/internal-types"

export const getTxCreator: GetTxCreator = (
  chainProvider,
  onCreateTx,
  signPayload,
) => {
  const getCreateTx = (): { createTx: CreateTx; disconnect: () => void } => {
    const client = getObservableClient(createClient(chainProvider))
    const chainHead = client.chainHead$()
    const metaCtx$ = chainHead.metadata$.pipe(
      filter(Boolean),
      withLatestFrom(chainHead.finalized$),
      take(1),
      map(([metadata, block]) => {
        const signedExtensions = getRelevantSignedExtensions(metadata)
        return { metadata, at: block.hash, signedExtensions }
      }),
    )

    const createTx: CreateTx = async (from, callData, hinted = {}) => {
      const { extra, pjs } = await firstValueFrom(
        metaCtx$.pipe(
          mergeMap(getTxData(from, callData, chainHead, hinted, onCreateTx)),
        ),
      )

      const result = await signPayload(pjs as SignerPayloadJSON)
      if (!result) throw new Error("User canceled")

      const preResult = mergeUint8(
        versionBytes,
        multiAddressEncoder(from),
        fromHex(result.signature),
        extra,
        callData,
      )
      return mergeUint8(compact.enc(preResult.length), preResult)
    }

    return {
      createTx,
      disconnect() {
        chainHead.unfollow()
        client.destroy()
      },
    }
  }

  let tx: ReturnType<typeof getCreateTx>
  let refCount = 0

  return (onMessage: (cb: string) => void) => {
    if (refCount++ === 0) tx = getCreateTx()
    const provider = chainProvider(onMessage)

    return {
      send: provider.send,
      disconnect() {
        if (--refCount === 0) tx.disconnect()
        provider.disconnect()
      },
      createTx: tx.createTx,
    }
  }
}
