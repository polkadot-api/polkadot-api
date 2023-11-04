import { blake2b } from "@noble/hashes/blake2b"
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
import { mergeUint8 } from "@polkadot-api/utils"

import type { CreateTx, GetTxCreator } from "@/."
import { getRelevantSignedExtensions } from "./get-relevant-signed-extensions"
import { multiAddressEncoder } from "./multi-address-encoder"
import { signatureEncoder } from "./signature-encoder"
import { getTxData } from "./get-tx-data"
import { versionBytes } from "./version-bytes"

export const getTxCreator: GetTxCreator = (chainProvider, onCreateTx) => {
  const client = getObservableClient(createClient(chainProvider))
  const chainHead = client.chainHead$()
  const metaCtx$ = chainHead.metadata$.pipe(
    filter(Boolean),
    withLatestFrom(chainHead.finalized$),
    take(1),
    map(([metadata, at]) => {
      const signedExtensions = getRelevantSignedExtensions(metadata)
      return { metadata, at, signedExtensions }
    }),
  )

  const createTx: CreateTx = async (from, callData, cb = onCreateTx) => {
    const {
      signer,
      signedExtensions: { value: extra, additionalSigned },
    } = await firstValueFrom(
      metaCtx$.pipe(mergeMap(getTxData(from, callData, chainHead, cb))),
    )

    const toSign = mergeUint8(callData, extra, additionalSigned)
    const signed = await signer.signer(
      toSign.length > 256 ? blake2b(toSign) : toSign,
    )

    const preResult = mergeUint8(
      versionBytes,
      multiAddressEncoder(from),
      signatureEncoder({ tag: signer.signingType, value: signed }),
      extra,
      callData,
    )
    return mergeUint8(compact.enc(preResult.length), preResult)
  }

  const destroy = () => {
    chainHead.unfollow()
    client.destroy()
  }

  return { createTx, destroy }
}
