import { AccountId, V15 } from "@polkadot-api/substrate-bindings"
import {
  UserSignedExtensionsData,
  OnCreateTxCtx,
  UserSignedExtensionName,
  HintedSignedExtensions,
} from ".."
import { getInput$ } from "./input"
import { combineLatest, map } from "rxjs"
import type { SignerPayloadJSON } from "@/types/internal-types"
import { getObservableClient } from "@polkadot-api/client"
import { mergeUint8, toHex } from "@polkadot-api/utils"
import {
  chainSignedExtensions,
  userSignedExtensions,
} from "@/get-tx-creator/signed-extensions"
import { getDynamicBuilder } from "@polkadot-api/metadata-builders"

interface Ctx {
  metadata: V15
  at: string
  signedExtensions: {
    all: string[]
    user: Array<UserSignedExtensionName>
    chain: Array<"CheckGenesis" | "CheckNonce" | "CheckSpecVersion">
    unknown: string[]
  }
}

export const getAddressFormat = (metadata: V15): number => {
  const dynamicBuilder = getDynamicBuilder(metadata)

  const constant = metadata.pallets
    .find((x) => x.name === "System")!
    .constants!.find((s) => s.name === "SS58Prefix")!

  return dynamicBuilder.buildDefinition(constant.type).dec(constant.value)
}

export const getTxData =
  <T extends Array<UserSignedExtensionName>>(
    from: Uint8Array,
    callData: Uint8Array,
    chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
    hintedSignedExtensions: HintedSignedExtensions,
    onCreateTx: (
      context: OnCreateTxCtx<T>,
      callback: (value: null | UserSignedExtensionsData<T>) => void,
    ) => void,
  ) =>
  ({ metadata, at, signedExtensions }: Ctx) => {
    const { all, user, chain, unknown } = signedExtensions
    const getUserInput$ = getInput$<T>(
      {
        from,
        callData,
        hintedSignedExtensions,
        userSingedExtensionsName: user as any,
        unknownSignedExtensions: unknown,
      },
      onCreateTx,
    )

    const chainSet = new Set(chain)
    const ctx = {
      from,
      callData,
      metadata,
      at,
      chainHead,
    }

    return combineLatest(
      all.map((key) => {
        if (chainSet.has(key as any))
          return chainSignedExtensions[key as "CheckNonce"](ctx)

        return userSignedExtensions[key as "CheckMortality"](
          getUserInput$(key as "CheckMortality") as any,
          ctx,
        )
      }),
    ).pipe(
      map((data) => {
        const extra: Array<Uint8Array> = []
        const additional: Array<Uint8Array> = []
        const pjs: Partial<SignerPayloadJSON> = {}
        data.forEach((x) => {
          extra.push(x.extra)
          additional.push(x.additional)
          Object.assign(pjs, x.pjs)
        })

        return {
          extra: mergeUint8(...extra),
          additional: mergeUint8(...additional),
          pjs: {
            ...pjs,
            address: AccountId(getAddressFormat(metadata)).dec(from),
            method: toHex(callData),
            version: 4,
            signedExtensions: all,
          },
        }
      }),
    )
  }
