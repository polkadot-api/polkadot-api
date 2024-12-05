import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  Binary,
  Blake2256,
  compact,
  decAnyMetadata,
  FixedSizeBinary,
  getSs58AddressInfo,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8, toHex } from "@polkadot-api/utils"

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
  const multisigAddr = "TODO"
  const publicAddr = toHex(signer.publicKey)
  const otherSignatories = multisig.signatories.filter((addr) => {
    const info = getSs58AddressInfo(addr)
    if (!info.isValid) throw new Error("Invalid address " + addr)
    return toHex(info.publicKey) !== publicAddr
  })
  if (otherSignatories.length === multisig.signatories.length) {
    throw new Error("Signer is not one of the signatories of the multisig")
  }

  return {
    // TODO should this be the publicKey of the multisig, or the public key of the actual signer?
    publicKey: signer.publicKey,
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
        getMultisigInfo(multisigAddr, Binary.fromBytes(callHash)),
        txPaymentInfo(
          Binary.fromBytes(unsignedExtrinsic),
          unsignedExtrinsic.length,
        ),
      ])
      if (
        multisigInfo?.approvals.some((approval) => {
          const info = getSs58AddressInfo(approval)
          return info.isValid && toHex(info.publicKey) === publicAddr
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
