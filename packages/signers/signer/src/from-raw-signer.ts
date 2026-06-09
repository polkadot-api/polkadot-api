import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata"
import { TxCreator } from "@polkadot-api/polkadot-signer"
import {
  createV4Tx,
  getSignBytes,
  TxCreatorChainApi,
  TxCreatorEnhancer,
  withCommonExtensions,
  withNonce,
} from "@polkadot-api/signers-common"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { firstValueFrom } from "rxjs"

const SR_MOCK = new Uint8Array(64).fill(0)
const ECDSA_MOCK = new Uint8Array(65).fill(0)

export const getTxCreator = (
  api: TxCreatorChainApi,
  publicKey: Uint8Array,
  signingType: "Ecdsa" | "Ed25519" | "Sr25519",
  sign: (input: Uint8Array) => Promise<Uint8Array> | Uint8Array,
) => {
  const creator: TxCreator<{}> = async (payload, _, mocked) => {
    const decMeta = unifyMetadata(decAnyMetadata(payload.context.metadata))
    const extra: Array<Uint8Array> = []
    const additionalSigned: Array<Uint8Array> = []

    const txExtVersion = payload.txExtVersion ?? 0
    if (txExtVersion !== 0)
      throw new Error("Only txExtVersion 0 is allowed for extrinsic v4")
    decMeta.extrinsic.extensionsByVersion[txExtVersion].forEach(
      ({ identifier }) => {
        const signedExtension = payload.extensions.find(
          ({ id }) => id === identifier,
        )
        if (!signedExtension)
          throw new Error(`Missing ${identifier} signed extension`)
        extra.push(fromHex(signedExtension.extra))
        additionalSigned.push(fromHex(signedExtension.additionalSigned))
      },
    )
    const callData = fromHex(payload.callData)
    const toSign = mergeUint8([callData, ...extra, ...additionalSigned])
    const signing =
      toSign.length > 256
        ? await firstValueFrom(api.txCreatorBindings.hasher(toSign))
        : toSign
    const signed = mocked
      ? signingType === "Ecdsa"
        ? ECDSA_MOCK
        : SR_MOCK
      : await sign(signing)
    return toHex(
      createV4Tx(decMeta, publicKey, signed, extra, callData, signingType),
    )
  }

  return Object.assign(
    withNonce(api, publicKey)(withCommonExtensions(api)(creator)),
    {
      publicKey,
      signBytes: getSignBytes(sign),
    },
  )
}

const METADATA_IDENTIFIER = "CheckMetadataHash"
const oneU8 = Uint8Array.from([1])

export const withMetadataHash: (
  networkInfo: Parameters<typeof merkleizeMetadata>[1],
) => TxCreatorEnhancer<{}> = (networkInfo) => (inner) => {
  return async (payload, opts, mocked) => {
    if (payload.extensions.find(({ id }) => id === METADATA_IDENTIFIER))
      return inner(payload, opts, mocked)
    const metadata = unifyMetadata(decAnyMetadata(payload.context.metadata))
    if (!metadata.extrinsic.extensions[METADATA_IDENTIFIER])
      throw new Error(`${METADATA_IDENTIFIER} not found`)
    const extra = toHex(oneU8)
    const additionalSigned = toHex(
      mergeUint8([
        oneU8,
        merkleizeMetadata(payload.context.metadata, networkInfo).digest(),
      ]),
    )
    payload.extensions.push({
      id: METADATA_IDENTIFIER,
      extra,
      additionalSigned,
    })
    return inner({ ...payload }, opts, mocked)
  }
}
