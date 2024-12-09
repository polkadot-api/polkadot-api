import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  AccountId,
  Binary,
  Blake2256,
  FixedSizeBinary,
  getMultisigAccountId,
  getSs58AddressInfo,
  sortMultisigSignatories,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"
import { getCodecs } from "./get-codecs"
import { WrappedSigner } from "./wrapped-signer"

const toSS58 = AccountId().dec

export interface MultisigSignerOptions {
  method: (
    approvals: Array<SS58String>,
    threshold: number,
  ) => "as_multi" | "approve_as_multi"
}
const defaultMultisigSignerOptions: MultisigSignerOptions = {
  method: (approvals, threshold) =>
    approvals.length === threshold - 1 ? "as_multi" : "approve_as_multi",
}

export function getMultisigSigner(
  multisig: {
    threshold: number
    signatories: SS58String[]
  },
  getMultisigInfo: (
    multisig: SS58String,
    callHash: FixedSizeBinary<32>,
  ) => Promise<
    | {
        when: {
          height: number
          index: number
        }
        approvals: Array<SS58String>
      }
    | undefined
  >,
  txPaymentInfo: (
    uxt: Binary,
    len: number,
  ) => Promise<{
    weight: {
      ref_time: bigint
      proof_size: bigint
    }
  }>,
  signer: PolkadotSigner | WrappedSigner,
  options?: MultisigSignerOptions,
): WrappedSigner {
  options = {
    ...defaultMultisigSignerOptions,
    ...options,
  }

  const pubKeys = sortMultisigSignatories(
    multisig.signatories.map((addr) => {
      const info = getSs58AddressInfo(addr)
      if (!info.isValid) throw new Error("Invalid address " + addr)
      return info.publicKey
    }),
  )
  const multisigId = getMultisigAccountId({
    threshold: multisig.threshold,
    signatories: pubKeys,
  })

  const signerAddress =
    "accountId" in signer ? signer.accountId : signer.publicKey
  const otherSignatories = pubKeys.filter(
    (addr) => !u8ArrEq(addr, signerAddress),
  )
  if (otherSignatories.length === multisig.signatories.length) {
    throw new Error("Signer is not one of the signatories of the multisig")
  }

  return {
    publicKey: signer.publicKey,
    accountId: multisigId,
    signBytes() {
      throw new Error("Raw bytes can't be signed with a multisig")
    },
    async signTx(callData, signedExtensions, metadata, atBlockNumber, hasher) {
      const callHash = Blake2256(callData)
      const { dynamicBuilder, callCodec } = getCodecs(metadata)

      // Try as_multi_threshold_1
      if (multisig.threshold === 1) {
        try {
          const { location, codec } = dynamicBuilder.buildCall(
            "Multisig",
            "as_multi_threshold_1",
          )
          const payload = codec.enc({
            other_signatories: otherSignatories.map(toSS58),
            call: callCodec.dec(callData),
          })
          const wrappedCallData = mergeUint8(new Uint8Array(location), payload)
          return signer.signTx(
            wrappedCallData,
            signedExtensions,
            metadata,
            atBlockNumber,
            hasher,
          )
        } catch (_) {}
      }

      const unsignedExtrinsic = mergeUint8(new Uint8Array([4]), callData)
      const [multisigInfo, weightInfo] = await Promise.all([
        getMultisigInfo(toSS58(multisigId), Binary.fromBytes(callHash)),
        txPaymentInfo(
          Binary.fromBytes(unsignedExtrinsic),
          unsignedExtrinsic.length,
        ),
      ])

      if (
        multisigInfo?.approvals.some((approval) => {
          const info = getSs58AddressInfo(approval)
          return info.isValid && u8ArrEq(info.publicKey, signer.publicKey)
        })
      ) {
        throw new Error("Multisig call already approved by signer")
      }

      const method = options.method(
        multisigInfo?.approvals ?? [],
        multisig.threshold,
      )

      let wrappedCallData
      try {
        const { location, codec } = dynamicBuilder.buildCall("Multisig", method)
        const payload = codec.enc({
          threshold: multisig.threshold,
          other_signatories: otherSignatories.map(toSS58),
          max_weight: weightInfo.weight,
          maybe_timepoint: multisigInfo?.when,
          ...(method === "as_multi"
            ? {
                call: callCodec.dec(callData),
              }
            : {
                call_hash: Binary.fromBytes(callHash),
              }),
        })
        wrappedCallData = mergeUint8(new Uint8Array(location), payload)
      } catch (_) {
        throw new Error(
          `Unsupported runtime version: Multisig.${method} not present or changed substantially`,
        )
      }

      return signer.signTx(
        wrappedCallData,
        signedExtensions,
        metadata,
        atBlockNumber,
        hasher,
      )
    },
  }
}

const u8ArrEq = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}
