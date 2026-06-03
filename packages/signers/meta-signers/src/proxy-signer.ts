import { MetadataLookup } from "@polkadot-api/metadata-builders"
import type { TxCreatorFactory } from "@polkadot-api/signers-common"
import {
  getSs58AddressInfo,
  HexString,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { getCodecs } from "./get-codecs"
import { WrapTxCreatorFactory } from "./wrapped-tx-creator"

export type ProxyAddress = SS58String | HexString

export function getProxyTxCreator<T extends TxCreatorFactory<any>>(
  proxyParams: {
    real: ProxyAddress
    type?: { type: string; value?: unknown }
  },
  txCreator: T & { publicKey: Uint8Array },
): WrapTxCreatorFactory<T> {
  const factory: TxCreatorFactory<any> = (chain) => {
    const inner = txCreator(chain)
    return async (payload, opts, mockedSignature) => {
      const { lookup, dynamicBuilder, callCodec } = getCodecs(
        fromHex(payload.context.metadata),
      )

      let wrappedCallData
      try {
        const { location, codec } = dynamicBuilder.buildCall("Proxy", "proxy")
        const wrappedPayload = codec.enc({
          real: wrapAddress(lookup, proxyParams.real),
          force_proxy_type: proxyParams.type,
          call: callCodec.dec(fromHex(payload.callData)),
        })
        wrappedCallData = mergeUint8([new Uint8Array(location), wrappedPayload])
      } catch {
        throw new Error(
          `Unsupported runtime version: Proxy.proxy not present or changed substantially`,
        )
      }

      return inner(
        { ...payload, callData: toHex(wrappedCallData) },
        opts,
        mockedSignature,
      )
    }
  }

  return Object.assign(factory as T, {
    publicKey: txCreator.publicKey,
    accountId: proxyAddressToU8Arr(proxyParams.real),
  })
}

/**
 * Best-effort to wrap the proxied address into what `Proxy.proxy.real` needs.
 * Should support MultiAddress, Address32 and Address20.
 */
function wrapAddress(lookup: MetadataLookup, address: SS58String | HexString) {
  const addressLookup = resolveAddressLookup(lookup)
  if (addressLookup.type === "enum") {
    // Assume MultiAddress
    if (address.startsWith("0x")) {
      const length = address.length / 2 - 1
      return {
        type: length === 32 ? "Address32" : length === 20 ? "Address20" : "Raw",
        value: address,
      }
    }
    return {
      type: "Id",
      value: address,
    }
  }

  // The chain probably doesn't use MultiAddress
  return address
}

function resolveAddressLookup(lookup: MetadataLookup) {
  const { metadata } = lookup
  if ("address" in metadata.extrinsic) {
    return lookup(metadata.extrinsic.address)
  }

  const palletCalls = lookup.metadata.pallets.find(
    (p) => p.name === "Proxy",
  )?.calls
  const callsType = palletCalls != null && lookup(palletCalls.type)
  const proxyCall =
    callsType && callsType.type === "enum" ? callsType.value["proxy"] : null
  const argumentType =
    proxyCall &&
    (proxyCall.type === "lookupEntry"
      ? proxyCall.value
      : proxyCall.type === "struct"
        ? proxyCall
        : null)
  const realType = argumentType?.type === "struct" && argumentType.value.real
  if (realType) {
    return realType
  }

  throw new Error(
    "Unsupported runtime version: Can't figure out type of Proxy.proxy.real",
  )
}

function proxyAddressToU8Arr(address: ProxyAddress) {
  if (address.startsWith("0x")) {
    return fromHex(address)
  }
  const info = getSs58AddressInfo(address)
  if (!info.isValid) {
    throw new Error(`Invalid SS58 address ${address}`)
  }
  return info.publicKey
}
