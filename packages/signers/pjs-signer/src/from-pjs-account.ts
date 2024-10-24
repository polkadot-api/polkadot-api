import {
  AccountId,
  Blake2256,
  type V14,
  type V15,
  decAnyMetadata,
} from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import * as signedExtensionMappers from "./pjs-signed-extensions-mappers"
import { SignPayload, SignRaw, SignerPayloadJSON } from "./types"
import { SignerType, v4TxHelper } from "@polkadot-api/signers-common"

export const getAddressFormat = (metadata: V14 | V15): number => {
  const dynamicBuilder = getDynamicBuilder(getLookupFn(metadata))

  const constant = metadata.pallets
    .find((x) => x.name === "System")!
    .constants!.find((s) => s.name === "SS58Prefix")!

  return dynamicBuilder.buildDefinition(constant.type).dec(constant.value)
}

const accountIdEnc = AccountId().enc
const getPublicKey = (address: string) =>
  address.startsWith("0x") && address.length === 42
    ? fromHex(address)
    : accountIdEnc(address)

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

    pjs.address = address
    pjs.method = toHex(callData)
    pjs.version = version
    pjs.withSignedTransaction = true // we allow the wallet to change the payload

    const result = await signPayload(pjs as SignerPayloadJSON)
    const tx = result.signedTransaction
    if (tx) return typeof tx === "string" ? fromHex(tx) : tx

    const { createTx, signerType } = v4TxHelper(decMeta)
    const publicKey =
      signerType === SignerType.Ethereum
        ? fromHex(address)
        : accountIdEnc(address)
    return createTx(publicKey, fromHex(result.signature), extra, callData)
  }

  return { publicKey, signTx, signBytes }
}
