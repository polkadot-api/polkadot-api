import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  AccountId,
  Binary,
  Blake2256,
  decAnyMetadata,
  FixedSizeBinary,
  getMultisigAccountId,
  getSs58AddressInfo,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"
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
): PolkadotSigner {
  options = {
    ...defaultMultisigSignerOptions,
    ...options,
  }

  const pubKeys = multisig.signatories
    .map((addr) => {
      const info = getSs58AddressInfo(addr)
      if (!info.isValid) throw new Error("Invalid address " + addr)
      return info.publicKey
    })
    .sort(cmpU8Arr)
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
    signBytes() {
      throw new Error("Raw bytes can't be signed with a multisig")
    },
    async signTx(callData, signedExtensions, metadata, atBlockNumber, hasher) {
      const callHash = Blake2256(callData)

      let lookup
      let dynamicBuilder
      try {
        const tmpMeta = decAnyMetadata(metadata).metadata
        if (tmpMeta.tag !== "v14" && tmpMeta.tag !== "v15") throw null
        lookup = getLookupFn(tmpMeta.value)
        if (lookup.call === null) throw null
        dynamicBuilder = getDynamicBuilder(lookup)
      } catch (_) {
        throw new Error("Unsupported metadata version")
      }

      // Try as_multi_threshold_1
      if (multisig.threshold === 1) {
        try {
          const { location, codec } = dynamicBuilder.buildCall(
            "Multisig",
            "as_multi_threshold_1",
          )
          const payload = codec.enc({
            other_signatories: otherSignatories.map(toSS58),
            call: dynamicBuilder.buildDefinition(lookup.call).dec(callData),
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
                call: dynamicBuilder.buildDefinition(lookup.call).dec(callData),
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
  if (a.length != b.length) return false
  return Array.from(a).every((v, i) => v === b[i])
}

const cmpU8Arr = (a: Uint8Array, b: Uint8Array) => {
  for (let i = 0; ; i++) {
    const overA = i >= a.length
    const overB = i >= b.length

    if (overA && overB) return 0
    else if (overA) return -1
    else if (overB) return 1
    else if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1
  }
}
