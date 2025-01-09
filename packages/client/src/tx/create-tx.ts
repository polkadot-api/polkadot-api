import { Observable, combineLatest, mergeMap, of, take } from "rxjs"
import { BlockInfo, ChainHead$ } from "@polkadot-api/observable-client"
import {
  ChargeAssetTxPayment,
  ChargeTransactionPayment,
  CheckMortality,
} from "./signed-extensions/user"
import * as chainSignedExtensions from "./signed-extensions/chain"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import { _void } from "@polkadot-api/substrate-bindings"
import { CustomSignedExtensionValues } from "./types"
import { mapObject } from "@polkadot-api/utils"

type HintedSignedExtensions = Partial<{
  tip: bigint
  mortality: { mortal: false } | { mortal: true; period: number }
  asset: Uint8Array
  nonce: number
}>

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
  chainHead.getRuntimeContext$(atBlock.hash).pipe(
    take(1),
    mergeMap((ctx) => {
      const signedExtensionsCtx = {
        lookupFn: ctx.lookup,
        dynamicBuilder: ctx.dynamicBuilder,
        chainHead: chainHead,
        callData: callData,
        at: atBlock.hash,
        from: signer.publicKey,
      }

      const mortality: Parameters<typeof CheckMortality>[0] = !hinted.mortality
        ? { period: 64, blockNumber: atBlock.number }
        : hinted.mortality.mortal
          ? { period: hinted.mortality.period, blockNumber: atBlock.number }
          : undefined // immortal

      return combineLatest(
        Object.fromEntries(
          ctx.lookup.metadata.extrinsic.signedExtensions
            .map(({ identifier, type, additionalSigned }) => {
              const stream = () => {
                if (identifier === "CheckMortality")
                  return CheckMortality(mortality, signedExtensionsCtx)

                if (identifier === "ChargeTransactionPayment")
                  return ChargeTransactionPayment(hinted.tip ?? 0n)

                if (identifier === "ChargeAssetTxPayment")
                  return ChargeAssetTxPayment(hinted.tip ?? 0n, hinted.asset)

                if (identifier === "CheckNonce" && "nonce" in hinted)
                  return chainSignedExtensions.getNonce(hinted.nonce!)

                const fn = chainSignedExtensions[identifier as "CheckGenesis"]
                if (fn) return fn(signedExtensionsCtx)

                // If we reached this point, that means that it's either an "empty" or a "custom" signed-extension
                const customEntry = customSignedExtensions[identifier] as any
                const [[valueEnc], [additionalSignedEnc]] = [
                  type,
                  additionalSigned,
                ].map(ctx.dynamicBuilder.buildDefinition)
                try {
                  return of(
                    mapObject(
                      {
                        value: valueEnc,
                        additionalSigned: additionalSignedEnc,
                      },
                      (encoder, key) => {
                        const input = customEntry?.[key]
                        // if the encoder is _void, then the input value is ignored, so no harm in passing `undefined`
                        // only an `Option` encoder will accept `undefined` as an input without crashing
                        return input instanceof Uint8Array
                          ? input
                          : encoder(input)
                      },
                    ),
                  )
                } catch {
                  // this means that a non optional custom signed-extension has not received its value
                  return null
                }
              }

              return [identifier, stream()!] as const
            })
            .filter((x) => x[1]),
        ),
      ).pipe(
        mergeMap((signedExtensions) =>
          signer.signTx(
            callData,
            mapObject(signedExtensions, (v, identifier: string) => ({
              identifier,
              ...v,
            })),
            ctx.metadataRaw,
            atBlock.number,
          ),
        ),
      )
    }),
  )
