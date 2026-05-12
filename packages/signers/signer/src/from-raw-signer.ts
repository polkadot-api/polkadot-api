import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  getSignBytes,
  createV4Tx,
  TxCreatorFactory,
  extensions,
} from "@polkadot-api/signers-common"
import {
  Blake2256,
  decAnyMetadata,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"

export function getPolkadotSigner(
  publicKey: Uint8Array,
  signingType: "Ecdsa" | "Ed25519" | "Sr25519",
  sign: (input: Uint8Array) => Promise<Uint8Array> | Uint8Array,
): PolkadotSigner {
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
    _: number,
    hasher = Blake2256,
  ) => {
    const decMeta = unifyMetadata(decAnyMetadata(metadata))
    const extra: Array<Uint8Array> = []
    const additionalSigned: Array<Uint8Array> = []
    decMeta.extrinsic.signedExtensions[0].map(({ identifier }) => {
      const signedExtension = signedExtensions[identifier]
      if (!signedExtension)
        throw new Error(`Missing ${identifier} signed extension`)
      extra.push(signedExtension.value)
      additionalSigned.push(signedExtension.additionalSigned)
    })

    const toSign = mergeUint8([callData, ...extra, ...additionalSigned])
    const signed = await sign(toSign.length > 256 ? hasher(toSign) : toSign)
    return createV4Tx(decMeta, publicKey, signed, extra, callData, signingType)
  }

  return {
    publicKey,
    signTx,
    signBytes: getSignBytes(sign),
  }
}

export const getTxCreatorFactoryV4 = (
  publicKey: Uint8Array,
  sign: (payload: Uint8Array) => Promise<Uint8Array> | Uint8Array,
  signingType?: "Ecdsa" | "Ed25519" | "Sr25519",
): TxCreatorFactory => {
  return ({ txCreatorBindings }) => {
    return async (payload) => {
      const lookupFn = getLookupFn(
        unifyMetadata(decAnyMetadata(payload.context.metadata)),
      )
      const builder = getDynamicBuilder(lookupFn)
      // this will create a signed extrinsic v4, we have to use signed extension 0
      const exts = lookupFn.metadata.extrinsic.signedExtensions[0]
      const encoded = await Promise.all(
        exts.map(async ({ identifier, type, additionalSigned }) => {
          const ext = payload.extensions.find(({ id }) => id === identifier)
          if (ext) {
            // ensure it is decodable with metadata
            try {
              builder.buildDefinition(type).dec(ext.extra)
              builder
                .buildDefinition(additionalSigned)
                .dec(ext.additionalSigned)
            } catch {
              throw new Error(`Cannot decode extension. Received ${ext}`)
            }
            return {
              value: fromHex(ext.extra),
              additionalSigned: fromHex(ext.additionalSigned),
            }
          }
          const mapper = extensions[identifier]
          if (mapper)
            return mapper(txCreatorBindings, payload.context, lookupFn, builder)
          // if there is no mapper, try if the extension is optional (or void)
          try {
            const exp = builder.buildDefinition(type).enc(undefined)
            const imp = builder.buildDefinition(additionalSigned).enc(undefined)
            return { value: exp, additionalSigned: imp }
          } catch {
            throw new Error(`Missing ${identifier} extension`)
          }
        }),
      )
      const callData = fromHex(payload.callData)
      const extra = encoded.map(({ value }) => value)
      const additionalSigned = encoded.map(
        ({ additionalSigned }) => additionalSigned,
      )
      const toSign = mergeUint8([callData, ...extra, ...additionalSigned])
      const signed = await sign(
        toSign.length > 256 ? Blake2256(toSign) : toSign,
      )
      return toHex(
        createV4Tx(
          lookupFn.metadata,
          publicKey,
          signed,
          extra,
          callData,
          signingType,
        ),
      )
    }
  }
}

const METADATA_IDENTIFIER = "CheckMetadataHash"
const oneU8 = Uint8Array.from([1])

export const withMetadataHash = (
  networkInfo: Parameters<typeof merkleizeMetadata>[1],
  base: PolkadotSigner,
): PolkadotSigner => ({
  ...base,
  signTx: async (callData, signedExtensions, metadata, ...rest) =>
    base.signTx(
      callData,
      signedExtensions[METADATA_IDENTIFIER]
        ? {
            ...signedExtensions,
            [METADATA_IDENTIFIER]: {
              identifier: METADATA_IDENTIFIER,
              value: oneU8,
              additionalSigned: mergeUint8([
                oneU8,
                merkleizeMetadata(metadata, networkInfo).digest(),
              ]),
            },
          }
        : signedExtensions,
      metadata,
      ...rest,
    ),
})
