import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  AccountId,
  Binary,
  Blake2256,
  compact,
  decAnyMetadata,
  FixedSizeBinary,
  getMultisigAccountId,
  getSs58AddressInfo,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"

export function multisigSigner(
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
  signer: PolkadotSigner,
): PolkadotSigner {
  const pubKeys = multisig.signatories.map((addr) => {
    const info = getSs58AddressInfo(addr)
    if (!info.isValid) throw new Error("Invalid address " + addr)
    return info.publicKey
  })
  const multisigId = getMultisigAccountId({
    threshold: multisig.threshold,
    signatories: pubKeys,
  })

  const otherSignatories = pubKeys.filter(
    (addr) => !u8ArrEq(addr, signer.publicKey),
  )
  if (otherSignatories.length === multisig.signatories.length) {
    throw new Error("Signer is not one of the signatories of the multisig")
  }

  return {
    publicKey: multisigId,
    signBytes() {
      throw new Error("Raw bytes can't be signed with a multisig")
    },
    async signTx(callData, signedExtensions, metadata, atBlockNumber, hasher) {
      const callHash = Blake2256(callData)

      const unsignedExtrinsic = mergeUint8(
        new Uint8Array([4]),
        compact.enc(callData.length),
        callData,
      )

      const [multisigInfo, weightInfo] = await Promise.all([
        getMultisigInfo(
          AccountId().dec(multisigId),
          Binary.fromBytes(callHash),
        ),
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

      let wrappedCallData
      try {
        const { location, codec } = dynamicBuilder.buildCall(
          "Multisig",
          "as_multi",
        )
        const payload = codec.enc({
          threshold: multisig.threshold,
          other_signatories: otherSignatories,
          call: dynamicBuilder.buildDefinition(lookup.call).dec(callData),
          max_weight: weightInfo.weight,
          maybe_timepoint: multisigInfo?.when,
        })
        wrappedCallData = mergeUint8(new Uint8Array(location), payload)
      } catch (_) {
        throw new Error(
          "Unsupported runtime version: Multisig.as_multi not present or changed substantially",
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
