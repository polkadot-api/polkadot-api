import {
  CommonEnhancersSpecs,
  createV5Tx,
  getSignBytes,
  withCommonExtensions,
  withNonce,
} from "@polkadot-api/signers-common"
import {
  _void,
  Binary,
  Bytes,
  decAnyMetadata,
  Enum,
  Struct,
  u8,
  UnifiedMetadata,
  unifyMetadata,
  Variant,
} from "@polkadot-api/substrate-bindings"
import {
  SignerTxCreator,
  TxArgSpec,
  TxCreator,
  TxCreatorBindings,
  TxCreatorEnhancer,
  TxPayloadV1,
} from "@polkadot-api/tx-creator"
import { fromHex, mergeUint8 } from "@polkadot-api/utils"
import { firstValueFrom } from "rxjs"

export const signatureExtensionTxCreator = <T extends string>(
  extensionId: T,
  // The return value must be the extension's `extra` SCALE encoded.
  getExtra: (
    payload: Uint8Array,
    mocked: boolean,
    bindings: TxCreatorBindings,
    metadata: UnifiedMetadata,
  ) => Promise<Uint8Array> | Uint8Array,
) => {
  const txCreator: TxCreator<[]> = async (payload, _, bindings, mocked) => {
    const decMeta = unifyMetadata(decAnyMetadata(payload.context.metadata))

    const txExtVersion = payload.txExtVersion!
    const pipeline = decMeta.extrinsic.extensionsByVersion[txExtVersion]
    const verifySignatureIdx = pipeline.findIndex(
      (extension) => extension.identifier === extensionId,
    )

    const extensionsToSign = getExtensionData(
      pipeline.slice(verifySignatureIdx + 1).map((v) => v.identifier),
      payload,
    )

    const callData = fromHex(payload.callData)
    const toSign = mergeUint8([
      u8.enc(txExtVersion),
      callData,
      ...extensionsToSign.extra,
      ...extensionsToSign.additionalSigned,
    ])
    const signed = await getExtra(toSign, mocked, bindings, decMeta)

    const preSignatureExtensions = getExtensionData(
      pipeline.slice(0, verifySignatureIdx).map((v) => v.identifier),
      payload,
    )

    return Binary.toHex(
      createV5Tx(
        txExtVersion,
        [...preSignatureExtensions.extra, signed, ...extensionsToSign.extra],
        callData,
      ),
    )
  }
  return withChooseTxVersion(extensionId)(txCreator)
}

const SR_MOCK = new Uint8Array(64).fill(0)
const ECDSA_MOCK = new Uint8Array(65).fill(0)

const MultiSignature = Variant({
  Disabled: _void,
  Signed: Struct({
    signature: Variant({
      Ed25519: Bytes(64),
      Sr25519: Bytes(64),
      Ecdsa: Bytes(65),
      Eth: Bytes(65),
    }),
    account: Bytes(Number.POSITIVE_INFINITY),
  }),
})

export const getVerifyMultiSignatureTxCreator = (
  publicKey: Uint8Array,
  signingType: "Ecdsa" | "Eth" | "Ed25519" | "Sr25519",
  sign: (input: Uint8Array) => Promise<Uint8Array> | Uint8Array,
): SignerTxCreator<
  [
    ...CommonEnhancersSpecs,
    TxArgSpec & {
      id: "VerifyMultiSignature"
      params: {
        extensionVersion?: number
      }
    },
  ]
> => {
  const creator = signatureExtensionTxCreator(
    "VerifyMultiSignature",
    async (payload, mocked, bindings) => {
      const signing = await firstValueFrom(bindings.hasher(payload))
      const signed = mocked
        ? signingType === "Ecdsa" || signingType === "Eth"
          ? ECDSA_MOCK
          : SR_MOCK
        : await sign(signing)

      return MultiSignature.enc(
        Enum("Signed", {
          signature: Enum(signingType, signed),
          account: publicKey,
        }),
      )
    },
  )

  return Object.assign(withNonce(publicKey)(withCommonExtensions(creator)), {
    publicKey,
    signBytes: getSignBytes(sign),
  })
}

const getExtensionData = (extensions: string[], payload: TxPayloadV1) => {
  const extra: Array<Uint8Array> = []
  const additionalSigned: Array<Uint8Array> = []

  extensions.forEach((identifier) => {
    const signedExtension = payload.extensions.find(
      ({ id }) => id === identifier,
    )
    if (!signedExtension)
      throw new Error(`Missing ${identifier} signed extension`)
    extra.push(fromHex(signedExtension.extra))
    additionalSigned.push(fromHex(signedExtension.additionalSigned))
  })
  return { extra, additionalSigned }
}

const withChooseTxVersion =
  <Id extends string>(
    identifier: Id,
  ): TxCreatorEnhancer<
    [
      TxArgSpec & {
        id: Id
        params: {
          extensionVersion?: number
        }
      },
    ]
  > =>
  (creator) =>
  (payload, options, bindings, mocked) => {
    const decMeta = unifyMetadata(decAnyMetadata(payload.context.metadata))

    const findExtensionVersion = () => {
      let txExtVersion = 0
      const declaredExtensions = new Set(payload.extensions.map((v) => v.id))
      while (txExtVersion in decMeta.extrinsic.extensionsByVersion) {
        if (
          decMeta.extrinsic.extensionsByVersion[txExtVersion].every(
            (extension) =>
              extension.identifier === identifier ||
              declaredExtensions.has(extension.identifier),
          ) &&
          decMeta.extrinsic.extensionsByVersion[txExtVersion].some(
            (extension) => extension.identifier === identifier,
          )
        )
          return txExtVersion
        txExtVersion++
      }

      throw new Error(
        `Provided signed extensions doesn't match any ${identifier} pipeline`,
      )
    }

    const extensionVersion =
      (options as { extensionVersion?: number }).extensionVersion ??
      findExtensionVersion()
    if (
      !decMeta.extrinsic.extensionsByVersion[extensionVersion].some(
        (v) => v.identifier === identifier,
      )
    ) {
      throw new Error(
        `Selected extension version doesn't have an ${identifier} extension`,
      )
    }

    return creator(
      { ...payload, txExtVersion: extensionVersion },
      options,
      bindings,
      mocked,
    )
  }
