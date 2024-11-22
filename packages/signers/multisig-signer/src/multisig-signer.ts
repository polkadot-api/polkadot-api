import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  decAnyMetadata,
  getSs58AddressInfo,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"

export function multisigSigner(
  multisig: {
    threshold: number
    signatories: SS58String[]
  },
  signer: PolkadotSigner,
): PolkadotSigner {
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
        wrappedCallData = dynamicBuilder
          .buildCall("Multisig", "as_multi")
          .codec.enc({
            threshold: multisig.threshold,
            other_signatories: otherSignatories,
            call: dynamicBuilder.buildDefinition(lookup.call).dec(callData),
            max_weight: {
              ref_time: 0,
              proof_size: 0,
            },
          })
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
