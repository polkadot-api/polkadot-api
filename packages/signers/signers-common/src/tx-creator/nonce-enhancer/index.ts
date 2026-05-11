import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { TxCreatorEnhancer } from "../types"
import {
  decAnyMetadata,
  u16,
  u32,
  u64,
  u8,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  firstValueFrom,
  map,
  of,
  scan,
  startWith,
  switchMap,
  take,
} from "rxjs"

const NONCE_ID = "CheckNonce"
const NONCE_RUNTIME_CALL = "AccountNonceApi_account_nonce"
const lenToDecoder = {
  1: u8.dec,
  2: u16.dec,
  4: u32.dec,
  8: u64.dec,
}

type Opts = {
  /**
   * Nonce for the transaction.
   * Default: higher nonce found in any tip of the chain.
   */
  nonce?: number
}

export const withNonce: (pubkey: Uint8Array) => TxCreatorEnhancer<Opts> =
  (pubkey) =>
  (innerFactory) =>
  ({ txCreatorBindings }) => {
    const inner = innerFactory({ txCreatorBindings })
    const getNonceAtBlock = async (at: string) => {
      const bytes = await txCreatorBindings.call(NONCE_RUNTIME_CALL, pubkey, at)
      const decoder = lenToDecoder[bytes.length as 2 | 4 | 8]
      if (!decoder)
        throw new Error(`${NONCE_RUNTIME_CALL} retrieved wrong data`)
      return decoder(bytes)
    }
    const followHead$ = (head: string) =>
      txCreatorBindings.blocks.pipe(
        scan(
          (acc, { tips }) =>
            tips.find(({ parent }) => parent === acc)?.hash ?? acc,
          head,
        ),
        startWith(head),
        distinctUntilChanged(),
      )
    const followNonce$ = (head: string) =>
      followHead$(head).pipe(
        take(2),
        switchMap((hash) => getNonceAtBlock(hash)),
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
    return async (payload, opts) => {
      const nonce =
        opts.nonce ??
        (await firstValueFrom(
          txCreatorBindings.blocks.pipe(
            take(1),
            map(({ tips }) => {
              // Grab only the higher height
              const height = Math.max(...tips.map(({ number }) => number))
              return tips
                .filter(({ number }) => number === height)
                .map(({ hash }) => hash)
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
          ),
        ))
      const lookupFn = getLookupFn(
        unifyMetadata(decAnyMetadata(payload.context.metadata)),
      )
      const builder = getDynamicBuilder(lookupFn)
      const txExtVersion = payload.txExtVersion ?? 0
      const exts = lookupFn.metadata.extrinsic.signedExtensions[txExtVersion]
      const nonceLookupType = exts.find(
        ({ identifier }) => identifier === NONCE_ID,
      )?.type
      if (nonceLookupType == null)
        throw new Error("`CheckNonce` extension not found")
      const extra = toHex(builder.buildDefinition(nonceLookupType).enc(nonce))
      const presentExt = payload.extensions.find(({ id }) => id === NONCE_ID)
      if (presentExt) presentExt.extra = extra
      else
        payload.extensions.push({ id: NONCE_ID, extra, additionalSigned: "0x" })

      return inner({ ...payload, txExtVersion }, opts)
    }
  }
