import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  Binary,
  Enum,
  FixedSizeBinary,
  getSs58AddressInfo,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"
import { getCodecs } from "./get-codecs"
import { WrappedSigner } from "./wrapped-signer"

export enum ProxyType {
  Any,
  NonTransfer,
  CancelProxy,
  Assets,
  AssetOwner,
  AssetManager,
  Collator,
}

export type ProxyAddress = Enum<{
  Id: SS58String
  Index: undefined
  Raw: Binary
  Address32: FixedSizeBinary<32>
  Address20: FixedSizeBinary<20>
}>

export function getProxySigner(
  proxyParams: {
    real: ProxyAddress
    type?: ProxyType
  },
  signer: PolkadotSigner | WrappedSigner,
): WrappedSigner {
  return {
    publicKey: signer.publicKey,
    accountId: proxyAddressToU8Arr(proxyParams.real),
    signBytes() {
      throw new Error("Raw bytes can't be signed with a proxy")
    },
    async signTx(callData, signedExtensions, metadata, atBlockNumber, hasher) {
      const { dynamicBuilder, callCodec } = getCodecs(metadata)

      let wrappedCallData
      try {
        const { location, codec } = dynamicBuilder.buildCall("Proxy", "proxy")
        const payload = codec.enc({
          real: proxyParams.real,
          force_proxy_type: proxyParams.type,
          call: callCodec.dec(callData),
        })
        wrappedCallData = mergeUint8(new Uint8Array(location), payload)
      } catch (_) {
        throw new Error(
          `Unsupported runtime version: Proxy.proxy not present or changed substantially`,
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

function proxyAddressToU8Arr(address: ProxyAddress) {
  switch (address.type) {
    case "Id": {
      const info = getSs58AddressInfo(address.value)
      if (!info.isValid) {
        throw new Error(`Invalid SS58 address ${address.value}`)
      }
      return info.publicKey
    }
    case "Index": {
      throw new Error("ProxyAddress.Index not supported")
    }
    default:
      return address.value.asBytes()
  }
}
