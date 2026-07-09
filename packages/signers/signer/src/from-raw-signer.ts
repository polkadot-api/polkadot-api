import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata"
import {
  TxArgSpec,
  TxCreator,
  TxCreatorEnhancer,
} from "@polkadot-api/polkadot-signer"
import {
  createV4Tx,
  getSignBytes,
  withCommonExtensions,
  withNonce,
} from "@polkadot-api/signers-common"
import {
  AccountId,
  decAnyMetadata,
  HexString,
  SS58String,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { firstValueFrom } from "rxjs"

const SR_MOCK = new Uint8Array(64).fill(0)
const ECDSA_MOCK = new Uint8Array(65).fill(0)

export const getTxCreator = (
  publicKey: Uint8Array,
  signingType: "Ecdsa" | "Ed25519" | "Sr25519",
  sign: (input: Uint8Array) => Promise<Uint8Array> | Uint8Array,
) => {
  const creator: TxCreator<[]> = async (
    payload,
    _,
    txCreatorBindings,
    mocked,
  ) => {
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
        ? await firstValueFrom(txCreatorBindings.hasher(toSign))
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

  return Object.assign(withNonce(publicKey)(withCommonExtensions(creator)), {
    publicKey,
    signBytes: getSignBytes(sign),
  })
}

const accId = AccountId().enc
const SIG = new Uint8Array(65).fill(0xcd)
SIG.set([0xde, 0xad, 0xbe, 0xef])
export const getFakeTxCreator = (
  address: SS58String | HexString | Uint8Array,
) => {
  let pubkey
  let type: "Ecdsa" | "Sr25519"
  if (address instanceof Uint8Array) {
    pubkey = address
    type = address.length === 32 ? "Sr25519" : "Ecdsa"
  } else {
    try {
      pubkey = accId(address)
      type = "Sr25519"
    } catch {
      try {
        pubkey = fromHex(address)
        type = "Ecdsa"
      } catch {
        throw new Error("Unable to detect address")
      }
    }
  }
  return getTxCreator(pubkey, type, () =>
    SIG.slice(0, type === "Sr25519" ? 64 : 65),
  )
}

const METADATA_IDENTIFIER = "CheckMetadataHash"
const oneU8 = Uint8Array.from([1])

export const withMetadataHash: (
  networkInfo: Parameters<typeof merkleizeMetadata>[1],
) => TxCreatorEnhancer<
  [
    TxArgSpec & {
      id: "CheckMetadataHash"
      params: {}
    },
  ]
> = (networkInfo) => (inner) => {
  return async (payload, opts, bindings, mocked) => {
    if (payload.extensions.find(({ id }) => id === METADATA_IDENTIFIER))
      return inner(payload, opts, bindings, mocked)
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
    return inner({ ...payload }, opts, bindings, mocked)
  }
}
