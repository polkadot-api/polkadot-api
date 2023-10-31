import { V14, v14 } from "@polkadot-api/substrate-bindings"
import { ConsumerCallback, OnCreateTxCtx, UserSignedExtensionName } from ".."
import { getInput$ } from "./input"
import { combineLatest, filter, map, startWith, take } from "rxjs"
import type { FlattenSignedExtension } from "@/internal-types"
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
    unknown: string[]
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
    const { all, user, chain, unknown } = signedExtensions
    const { overrides$, getUserInput$, signer$ } = getInput$<T>(
      {
        from,
        callData,
        metadata: v14.enc(metadata),
        userSingedExtensionsName: user as any,
        unknownSignedExtensions: unknown,
      },
      onCreateTx,
    )

    const withOverrides = (
      input$: FlattenSignedExtension,
      name: string,
    ): FlattenSignedExtension => {
      const inputWithNull$ = input$.pipe(startWith(null))

      return combineLatest([inputWithNull$, overrides$]).pipe(
        map(([inputWithNull, overrides]) => overrides[name] ?? inputWithNull),
        filter(Boolean),
        take(1),
      )
    }

    const chainSet = new Set(chain)
    const userSet = new Set(user)
    const ctx = {
      from,
      callData,
      metadata,
      at,
      chainHead,
    }

    const signedExtensions$ = combineLatest(
      all.map((key) => {
        if (chainSet.has(key as any))
          return withOverrides(
            combineLatest(chainSignedExtensions[key as "CheckNonce"](ctx)),
            key,
          )

        if (userSet.has(key as any))
          return withOverrides(
            combineLatest(
              userSignedExtensions[key as "CheckMortality"](
                getUserInput$(key as "CheckMortality") as any,
                ctx,
              ),
            ),
            key,
          )

        return overrides$.pipe(
          map(
            (overrides) =>
              overrides[key] ?? {
                value: new Uint8Array(),
                additionalSigned: new Uint8Array(),
              },
          ),
        )
      }),
    ).pipe(
      map((data) => {
        const extra: Array<Uint8Array> = []
        const additional: Array<Uint8Array> = []

        data.forEach((x) => {
          extra.push(x.value)
          additional.push(x.additionalSigned)
        })

        return {
          value: mergeUint8(...extra),
          additionalSigned: mergeUint8(...additional),
        }
      }),
    )

    return combineLatest({
      signedExtensions: signedExtensions$,
      signer: signer$,
    })
  }
