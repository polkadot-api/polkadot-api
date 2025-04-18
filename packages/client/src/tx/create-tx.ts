import { HexString, u16, u32, u64, u8 } from "@polkadot-api/substrate-bindings"
import { Observable, combineLatest, map, mergeMap, of, take } from "rxjs"
import { BlockInfo, ChainHead$ } from "@polkadot-api/observable-client"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import { _void } from "@polkadot-api/substrate-bindings"
import { CustomSignedExtensionValues } from "./types"
import { fromHex, toHex } from "@polkadot-api/utils"
import { getSignExtensionsCreator } from "./signed-extensions"

type HintedSignedExtensions = Partial<{
  tip: bigint
  mortality: { mortal: false } | { mortal: true; period: number }
  asset: Uint8Array
  nonce: number
}>

const NONCE_RUNTIME_CALL = "AccountNonceApi_account_nonce"
const lenToDecoder = {
  1: u8.dec,
  2: u16.dec,
  4: u32.dec,
  8: u64.dec,
}

const getNonce$ = (call$: ChainHead$["call$"], from: HexString, at: string) =>
  call$(at, NONCE_RUNTIME_CALL, from).pipe(
    map((result) => {
      const bytes = fromHex(result)
      const decoder = lenToDecoder[bytes.length as 2 | 4 | 8]
      if (!decoder)
        throw new Error(`${NONCE_RUNTIME_CALL} retrieved wrong data`)
      return decoder(bytes)
    }),
  )

export const createTx: (
  chainHead: ChainHead$,
  signer: PolkadotSigner,
  callData: Uint8Array,
  atBlock: BlockInfo,
  customSignExt: Record<string, CustomSignedExtensionValues>,
  hinted?: HintedSignedExtensions,
) => Observable<Uint8Array> = (
  chainHead,
  signer,
  callData,
  atBlock,
  customSignedExtensions,
  hinted = {},
) =>
  combineLatest([
    hinted.nonce
      ? of(hinted.nonce)
      : getNonce$(chainHead.call$, toHex(signer.publicKey), atBlock.hash),
    chainHead.getRuntimeContext$(atBlock.hash),
    chainHead.genesis$,
  ]).pipe(
    take(1),
    mergeMap(([nonce, ctx, genesis]) => {
      const signExtCreator = getSignExtensionsCreator(
        fromHex(genesis),
        ctx.lookup,
        ctx.dynamicBuilder,
      )

      const mortality: HintedSignedExtensions["mortality"] =
        hinted.mortality ?? { period: 64, mortal: true }

      const signExtensions = signExtCreator({
        nonce: nonce as number,
        tip: hinted.tip ?? 0n,
        mortality: mortality.mortal
          ? {
              mortal: true,
              period: mortality.period,
              startAtBlock: {
                height: atBlock.number,
                hash: atBlock.hash,
              },
            }
          : { mortal: false },
        customSignedExtensions,
      })

      return signer.signTx(
        callData,
        signExtensions,
        ctx.metadataRaw,
        atBlock.number,
      )
    }),
  )
