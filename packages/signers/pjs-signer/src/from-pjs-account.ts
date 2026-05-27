import {
  createV4Tx,
  TxCreatorFactory,
  withCommonExtensions,
  withNonce,
} from "@polkadot-api/signers-common"
import {
  AccountId,
  decAnyMetadata,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"
import * as signedExtensionMappers from "./pjs-signed-extensions-mappers"
import { KeypairType, SignerPayloadJSON, SignPayload, SignRaw } from "./types"

const accountIdEnc = AccountId().enc
const getPublicKey = (address: string) =>
  address.startsWith("0x") ? fromHex(address) : accountIdEnc(address)

const TYPE_MAP: Record<KeypairType, Parameters<typeof createV4Tx>[5]> = {
  ed25519: "Ed25519",
  ecdsa: "Ecdsa",
  sr25519: "Sr25519",
}

const SR_MOCK = "0x" + "0".repeat(128)
const ECDSA_MOCK = SR_MOCK + "00"

export function getTxCreatorFromPjs(
  address: string,
  signPayload: SignPayload,
  signRaw: SignRaw,
  type?: KeypairType,
) {
  const signBytes = (data: Uint8Array) =>
    signRaw({
      address,
      data: toHex(data),
      type: "bytes",
    }).then(({ signature }) => fromHex(signature))
  const publicKey = getPublicKey(address)
  const creator: TxCreatorFactory<{}> = () => async (payload, _, mocked) => {
    const decMeta = unifyMetadata(decAnyMetadata(payload.context.metadata))

    const pjs: Partial<SignerPayloadJSON> = {}
    pjs.signedExtensions = []
    const { version } = decMeta.extrinsic
    const extra: Array<Uint8Array> = []

    if (payload.txExtVersion != null && payload.txExtVersion !== 0)
      throw new Error("Only txExtVersion 0 is allowed for extrinsic v4")

    decMeta.extrinsic.extensionsByVersion[0].forEach(({ identifier }) => {
      const signedExtension = payload.extensions.find(
        ({ id }) => id === identifier,
      )
      if (!signedExtension)
        throw new Error(`Missing ${identifier} signed-extension`)
      extra.push(fromHex(signedExtension.extra))

      pjs.signedExtensions!.push(identifier)

      if (!signedExtensionMappers[identifier as "CheckMortality"]) {
        if (
          fromHex(signedExtension.extra).length === 0 &&
          fromHex(signedExtension.additionalSigned).length === 0
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
          payload.context.bestBlockHeight,
        ),
      )
    })

    const checkedVersion = version.includes(4) ? 4 : null
    if (checkedVersion == null)
      throw new Error("Only extrinsic v4 is supported")
    pjs.address = address
    pjs.method = payload.callData
    pjs.version = checkedVersion
    pjs.withSignedTransaction = true // we allow the wallet to change the payload

    const result = mocked
      ? { signature: type === "ecdsa" ? ECDSA_MOCK : SR_MOCK }
      : await signPayload(pjs as SignerPayloadJSON)
    const tx = result.signedTransaction
    if (tx) return typeof tx === "string" ? tx : toHex(tx)

    return toHex(
      createV4Tx(
        decMeta,
        publicKey,
        fromHex(result.signature),
        extra,
        fromHex(payload.callData),
        mocked && type ? TYPE_MAP[type] : undefined,
      ),
    )
  }

  return Object.assign(withCommonExtensions(withNonce(publicKey)(creator)), {
    publicKey,
    signBytes,
  })
}

export type Opts =
  ReturnType<typeof getTxCreatorFromPjs> extends TxCreatorFactory<infer O>
    ? O
    : never
