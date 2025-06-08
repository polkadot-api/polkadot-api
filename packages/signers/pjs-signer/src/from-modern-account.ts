import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  AccountId,
  Blake2256,
  decAnyMetadata,
  HexString,
  UnifiedMetadata,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"
import { SignRaw, SignTransaction } from "./types"

const accountIdEnc = AccountId().enc
const getPublicKey = (address: string) =>
  address.startsWith("0x") ? fromHex(address) : accountIdEnc(address)

const cache = new WeakMap<
  Uint8Array,
  { hexMeta: HexString; decMeta: UnifiedMetadata }
>()
const getMetadataInfo = (rawMetadata: Uint8Array) => {
  let result = cache.get(rawMetadata)
  if (result) return result
  result = {
    hexMeta: toHex(rawMetadata),
    decMeta: unifyMetadata(decAnyMetadata(rawMetadata)),
  }
  cache.set(rawMetadata, result)
  return result
}

export function getPolkadotSignerFromModern(
  address: string,
  _signTx: SignTransaction,
  signRaw: SignRaw,
): PolkadotSigner {
  const signBytes = (data: Uint8Array) =>
    signRaw({
      address,
      data: toHex(data),
      type: "bytes",
    }).then(({ signature }) => fromHex(signature))

  const publicKey = getPublicKey(address)
  const publicKeyHex = toHex(publicKey)

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
    const { decMeta, hexMeta } = getMetadataInfo(metadata)
    return fromHex(
      await _signTx({
        signedExtensions: decMeta.extrinsic.signedExtensions
          .map((x) => signedExtensions[x.identifier])
          .filter(Boolean)
          .map(({ identifier, value, additionalSigned }) => ({
            identifier,
            value: toHex(value),
            additionalSigned: toHex(additionalSigned),
          })),
        publicKey: publicKeyHex,
        callData: toHex(callData),
        metadata: hexMeta,
        atBlockNumber: atBlockNumber,
      }),
    )
  }

  return { publicKey, signTx, signBytes }
}
