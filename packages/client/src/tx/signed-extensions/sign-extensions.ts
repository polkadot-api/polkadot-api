import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { Encoder } from "@polkadot-api/substrate-bindings"
import { OfflineTxExtensions } from "../types"
import { fromHex, mapObject } from "@polkadot-api/utils"
import { getSystemVersionStruct } from "./system-version"
import { mortal } from "./mortal-enc"
import { ChargeAssetTxPaymentEnc } from "./charge-asset-tx-enc"

const empty = new Uint8Array()
const zero = Uint8Array.from([0])
type DynamicBuilder = ReturnType<typeof getDynamicBuilder>

const value = (value: Uint8Array) => ({
  value,
  additionalSigned: empty,
})
const additionalSigned = (additionalSigned: Uint8Array) => ({
  value: empty,
  additionalSigned,
})
const both = (value: Uint8Array, additionalSigned: Uint8Array) => ({
  value,
  additionalSigned,
})

export const getSignExtensionsCreator = (
  genesis: Uint8Array,
  lookupFn: MetadataLookup,
  dynamicBuilder: DynamicBuilder,
) => {
  const signedExtensionsEncoders: Record<string, [Encoder<any>, Encoder<any>]> =
    {}
  lookupFn.metadata.extrinsic.signedExtensions.forEach(
    ({ identifier, type, additionalSigned }) => {
      signedExtensionsEncoders[identifier] = [type, additionalSigned].map(
        (x) => dynamicBuilder.buildDefinition(x)[0],
      ) as [Encoder<any>, Encoder<any>]
    },
  )

  return <Asset>({
    mortality,
    tip = 0n,
    nonce,
    customSignedExtensions = {},
    ...rest
  }: OfflineTxExtensions<Asset>): Record<
    string,
    { identifier: string; value: Uint8Array; additionalSigned: Uint8Array }
  > => {
    const invalidKeys: string[] = []
    const systemVersion = getSystemVersionStruct(lookupFn, dynamicBuilder)
    const getFromCustomEntry = (key: string) => {
      const [valueEnc, additionalEnc] = signedExtensionsEncoders[key]
      const customEntry = customSignedExtensions[key] as any
      try {
        return mapObject(
          {
            value: valueEnc,
            additionalSigned: additionalEnc,
          },
          (encoder, key) => {
            const input = customEntry?.[key]
            // if the encoder is _void, then the input value is ignored, so no harm in passing `undefined`
            // only an `Option` encoder will accept `undefined` as an input without crashing
            return input instanceof Uint8Array ? input : encoder(input)
          },
        )
      } catch {
        // this means that a non optional custom signed-extension has not received its value
        invalidKeys.push(key)
        return null
      }
    }

    const result = mapObject(
      signedExtensionsEncoders,
      ([valueEnc, additionalEnc], key) => {
        if (customSignedExtensions[key]) return getFromCustomEntry(key)

        switch (key) {
          case "CheckNonce":
            return value(valueEnc(nonce))

          case "CheckMortality":
            return mortality.mortal
              ? both(
                  mortal({
                    period: mortality.period,
                    phase: mortality.startAtBlock.height % mortality.period,
                  }),
                  fromHex(mortality.startAtBlock.hash),
                )
              : both(zero, genesis)

          case "ChargeTransactionPayment":
            return value(valueEnc(tip))

          case "ChargeAssetTxPayment":
            return value(
              ChargeAssetTxPaymentEnc({
                tip,
                asset: (rest as any).asset,
              }),
            )

          case "CheckGenesis":
            return additionalSigned(genesis)

          case "CheckMetadataHash":
            return both(zero, zero)

          case "CheckSpecVersion":
            return additionalSigned(
              additionalEnc(systemVersion["spec_version"]),
            )

          case "CheckTxVersion":
            return additionalSigned(
              additionalEnc(systemVersion["transaction_version"]),
            )

          default:
            return getFromCustomEntry(key)
        }
      },
    )

    invalidKeys.forEach((key) => {
      delete result[key]
    })
    return mapObject(result, (x, identifier) => ({ ...x, identifier })) as any
  }
}
