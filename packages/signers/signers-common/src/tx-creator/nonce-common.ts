import { TxPayloadV1 } from "@polkadot-api/polkadot-signer"
import type { TxCreatorBindings } from "./types"
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
import {
  decAnyMetadata,
  u16,
  u32,
  u64,
  u8,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { toHex } from "@polkadot-api/utils"

const NONCE_RUNTIME_CALL = "AccountNonceApi_account_nonce"
const lenToDecoder = {
  1: u8.dec,
  2: u16.dec,
  4: u32.dec,
  8: u64.dec,
}

export const getNonce = async (
  bindings: TxCreatorBindings,
  context: TxPayloadV1["context"],
  pubkey: Uint8Array,
): Promise<TxPayloadV1["extensions"][number]> => {
  const getNonceAtBlock = async (at: string) => {
    const bytes = await bindings.call(NONCE_RUNTIME_CALL, pubkey, at)
    const decoder = lenToDecoder[bytes.length as 2 | 4 | 8]
    if (!decoder) throw new Error(`${NONCE_RUNTIME_CALL} retrieved wrong data`)
    return decoder(bytes)
  }
  const followHead$ = (head: string) =>
    bindings.blocks.pipe(
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
  const res = await firstValueFrom(
    bindings.blocks.pipe(
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
  )
  const lookupFn = getLookupFn(unifyMetadata(decAnyMetadata(context.metadata)))
  const extraNonce = lookupFn.metadata.extrinsic.signedExtensions[0].find(
    ({ identifier }) => identifier === "CheckNonce",
  )?.type
  if (extraNonce == null) throw new Error("`CheckNonce` extension not found")
  const extra = getDynamicBuilder(lookupFn).buildDefinition(extraNonce).enc(res)
  return {
    id: "CheckNonce",
    extra: toHex(extra),
    additionalSigned: "0x",
  }
}
