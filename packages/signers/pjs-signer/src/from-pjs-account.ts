import {
  AccountId,
  Blake2256,
  type V14,
  type V15,
  compact,
  decAnyMetadata,
  enhanceEncoder,
  u8,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import * as signedExtensionMappers from "./pjs-signed-extensions-mappers"
import { SignPayload, SignRaw, SignerPayloadJSON } from "./types"

export const getAddressFormat = (metadata: V14 | V15): number => {
  const dynamicBuilder = getDynamicBuilder(getLookupFn(metadata))

  const constant = metadata.pallets
    .find((x) => x.name === "System")!
    .constants!.find((s) => s.name === "SS58Prefix")!

  return dynamicBuilder.buildDefinition(constant.type).dec(constant.value)
}

const versionCodec = enhanceEncoder(
  u8.enc,
  (value: { signed: boolean; version: number }) =>
    (+!!value.signed << 7) | value.version,
)

const getPublicKey = AccountId().enc
export function getPolkadotSignerFromPjs(
  address: string,
  signPayload: SignPayload,
  signRaw: SignRaw,
): PolkadotSigner {
  const signBytes = (data: Uint8Array) =>
    signRaw({
      address,
      data: toHex(data),
      type: "bytes",
    }).then(({ signature }) => fromHex(signature))
  const publicKey = getPublicKey(address)
  const signTx = async (
    callData: Uint8Array,
    signedExtensions: Record<
      string,
      {
        identifier: string
        value: Uint8Array
        additionalSigned: Uint8Array
      }
    >,
    metadata: Uint8Array,
    atBlockNumber: number,
    _ = Blake2256,
  ) => {
    let decMeta: V14 | V15
    try {
      const tmpMeta = decAnyMetadata(metadata)
      if (tmpMeta.metadata.tag !== "v14" && tmpMeta.metadata.tag !== "v15")
        throw null
      decMeta = tmpMeta.metadata.value
    } catch (_) {
      throw new Error("Unsupported metadata version")
    }

    const pjs: Partial<SignerPayloadJSON> = {}
    pjs.signedExtensions = []

    const { version } = decMeta.extrinsic
    const extra: Array<Uint8Array> = []

    decMeta.extrinsic.signedExtensions.map(({ identifier }) => {
      const signedExtension = signedExtensions[identifier]
      if (!signedExtension)
        throw new Error(`Missing ${identifier} signed-extension`)
      extra.push(signedExtension.value)

      pjs.signedExtensions!.push(identifier)

      if (!signedExtensionMappers[identifier as "CheckMortality"]) {
        if (
          signedExtension.value.length === 0 &&
          signedExtension.additionalSigned.length === 0
        )
          return
        throw new Error(
          `PJS does not support this signed-extension: ${identifier}`,
        )
      }

      Object.assign(
        pjs,
        signedExtensionMappers[identifier as "CheckMortality"](
          signedExtension,
          atBlockNumber,
        ),
      )
    })

    pjs.address = AccountId(getAddressFormat(decMeta)).dec(publicKey)
    pjs.method = toHex(callData)
    pjs.version = version
    pjs.withSignedTransaction = true // we allow the wallet to change the payload

    const result = await signPayload(pjs as SignerPayloadJSON)

    if (!result.signedTransaction) {
      const preResult = mergeUint8(
        versionCodec({ signed: true, version }),
        // converting it to a `MultiAddress` enum, where the index 0 is `Id(AccountId)`
        new Uint8Array([0, ...publicKey]),
        fromHex(result.signature),
        ...extra,
        callData,
      )
      return mergeUint8(compact.enc(preResult.length), preResult)
    }
    return typeof result.signedTransaction === "string"
      ? fromHex(result.signedTransaction)
      : result.signedTransaction
  }

  return { publicKey, signTx, signBytes }
}
