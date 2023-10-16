import { V14, v14 } from "@polkadot-api/substrate-bindings"
import { ConsumerCallback, OnCreateTxCtx, UserSignedExtensionName } from ".."
import { getInput$ } from "./input"
import {
  EMPTY,
  NEVER,
  Observable,
  combineLatest,
  map,
  mergeMap,
  of,
  race,
} from "rxjs"
import type { SignedExntension } from "@/internal-types"
import { getObservableClient } from "@polkadot-api/client"
import { mergeUint8 } from "@polkadot-api/utils"
import {
  chainSignedExtensions,
  userSignedExtensions,
} from "@/signed-extensions"

interface Ctx {
  metadata: V14
  at: string
  signedExtensions: {
    all: string[]
    user: Array<UserSignedExtensionName>
    chain: Array<"CheckGenesis" | "CheckNonce" | "CheckSpecVersion">
    unkown: string[]
  }
}

export const getTxData =
  <T extends Array<UserSignedExtensionName>>(
    from: Uint8Array,
    callData: Uint8Array,
    chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
    onCreateTx: (
      context: OnCreateTxCtx<T>,
      callback: (value: null | ConsumerCallback<T>) => void,
    ) => void,
  ) =>
  ({ metadata, at, signedExtensions }: Ctx) => {
    const { all, user, chain, unkown } = signedExtensions
    const { overrides$, getUserInput$, signer$ } = getInput$<T>(
      {
        from,
        callData,
        metadata: v14.enc(metadata),
        userSingedExtensionsName: user as any,
        unknownSignedExtensions: unkown,
      },
      onCreateTx,
    )

    const fromOverrides = (
      name: string,
      type: "value" | "additionalSigned",
      endless: boolean,
    ) =>
      overrides$.pipe(
        mergeMap((overrides) =>
          overrides[name] ? of(overrides[name][type]) : endless ? NEVER : EMPTY,
        ),
      )

    const withOverrides = (
      { additional, extra }: SignedExntension,
      name: string,
    ): SignedExntension => ({
      additional: race([fromOverrides(name, "value", true), additional]),
      extra: race([fromOverrides(name, "additionalSigned", true), extra]),
    })

    const extra: Array<Observable<Uint8Array>> = []
    const additional: Array<Observable<Uint8Array>> = []

    const chainSet = new Set(chain)
    const userSet = new Set(user)
    const ctx = {
      from,
      callData,
      metadata,
      at,
      chainHead,
    }

    all
      .map((key) => {
        if (chainSet.has(key as any))
          return withOverrides(
            chainSignedExtensions[key as "CheckNonce"](ctx),
            key,
          )

        if (userSet.has(key as any))
          return withOverrides(
            userSignedExtensions[key as "CheckMortality"](
              getUserInput$(key as "CheckMortality") as any,
              ctx,
            ),
            key,
          )

        return {
          extra: fromOverrides(key, "value", false),
          additional: fromOverrides(key, "additionalSigned", false),
        }
      })
      .forEach((value) => {
        additional.push(value.additional)
        extra.push(value.extra)
      })

    const extra$ = combineLatest(extra).pipe(map((x) => mergeUint8(...x)))
    const additional$ = combineLatest(additional).pipe(
      map((x) => mergeUint8(...x)),
    )

    return combineLatest({
      signer: signer$,
      extra: extra$,
      additional: additional$,
    })
  }
