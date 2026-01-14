import { BlockInfo, ChainHead$ } from "@polkadot-api/observable-client"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import { HexString, u16, u32, u64, u8 } from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"
import {
  Observable,
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  mergeMap,
  of,
  scan,
  startWith,
  switchMap,
  take,
} from "rxjs"
import { getSignExtensionsCreator } from "./signed-extensions"
import { CustomSignedExtensionValues } from "./types"

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

const getNonceAtBlock$ = (
  call$: ChainHead$["call$"],
  from: HexString,
  at: string,
) =>
  call$(at, NONCE_RUNTIME_CALL, from).pipe(
    map((bytes) => {
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
      : getNonce$(chainHead, toHex(signer.publicKey)),
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
        asset: hinted.asset,
      })

      return signer.signTx(
        callData,
        signExtensions,
        ctx.metadataRaw,
        atBlock.number,
      )
    }),
  )

const getNonce$ = (chainHead: ChainHead$, from: HexString) => {
  const followHead$ = (head: string) =>
    chainHead.newBlocks$.pipe(
      scan((acc, block) => (block.parent === acc ? block.hash : acc), head),
      startWith(head),
      distinctUntilChanged(),
    )
  const followNonce$ = (head: string) =>
    followHead$(head).pipe(
      take(2),
      switchMap((hash) => getNonceAtBlock$(chainHead.call$, from, hash)),
    )
  const getHeadsNonce$ = (heads: string[]) =>
    combineLatest(
      heads.map((head) =>
        followNonce$(head).pipe(
          map((value) => ({
            success: true as const,
            value,
          })),
          catchError((err) =>
            of({
              success: false as const,
              value: err,
            }),
          ),
        ),
      ),
    ).pipe(take(1))

  return chainHead.pinnedBlocks$.pipe(
    take(1),
    map(({ blocks, best }) => {
      // Grab only the heads: those blocks above the best that don't have children and are not getting pruned
      const bestBlock = blocks.get(best)!
      return [...blocks.values()]
        .filter(
          (v) =>
            !v.pruned && v.children.size === 0 && v.number >= bestBlock.number,
        )
        .map((v) => v.hash)
    }),
    switchMap(getHeadsNonce$),
    map((result) => {
      const winner = result.reduce(
        (acc: bigint | number | null, v) =>
          v.success ? (v.value >= (acc ?? 0) ? v.value : acc) : acc,
        null,
      )

      if (winner == null) {
        // We must have at least one error
        throw result[0].value
      }
      return winner
    }),
  )
}
