import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { ChainDefinition, PlainDescriptor } from "./descriptors"
import { OfflineTxEntry } from "./tx"
import {
  Binary,
  Enum,
  metadata as metadataCodec,
  V14,
  V15,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { OfflineApi } from "./types"
import { getSignExtensionsCreator } from "./tx/signed-extensions"

const createOfflineTxEntry = <
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset extends PlainDescriptor<any>,
>(
  pallet: Pallet,
  name: Name,
  metadataRaw: Uint8Array,
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  signExtensionCreator: ReturnType<typeof getSignExtensionsCreator>,
): OfflineTxEntry<Arg, Pallet, Name, Asset> => {
  let codecs
  try {
    codecs = dynamicBuilder.buildCall(pallet, name)
  } catch {
    throw new Error(`Runtime entry Tx(${pallet}.${name}) not found`)
  }
  const { location, codec } = codecs
  const locationBytes = new Uint8Array(location)

  return (arg: Arg) => {
    const encodedData = Binary.fromBytes(
      mergeUint8(locationBytes, codec.enc(arg)),
    )

    return {
      encodedData,
      decodedCall: Enum(pallet, Enum(name, arg as any) as any),
      sign: async (from, extensions) =>
        toHex(
          await from.signTx(
            encodedData.asBytes(),
            signExtensionCreator(extensions),
            metadataRaw,
            extensions.mortality.mortal
              ? extensions.mortality.startAtBlock.height
              : 0,
          ),
        ),
    }
  }
}

/**
 * Asynchronously create an instance of `OfflineApi`.
 * OfflineApi allows to create and sign transactions, accessing as well to chain
 * constants.
 *
 * @param chainDefinition  Pass descriptors from `@polkadot-api/descriptors`
 *                         generated by `papi` CLI.
 */
export const getOfflineApi: <D extends ChainDefinition>(
  chainDefinition: D,
) => Promise<OfflineApi<D>> = async ({ genesis: genesisHex, getMetadata }) => {
  if (!genesisHex) throw new Error("Missing genesis hash")
  const genesis = fromHex(genesisHex)
  const metadataRaw = await getMetadata()
  const metadata = metadataCodec.dec(metadataRaw).metadata.value as V14 | V15
  const lookupFn = getLookupFn(metadata)
  const dynamicBuilder = getDynamicBuilder(lookupFn)
  const signExtensionCreator = getSignExtensionsCreator(
    genesis,
    lookupFn,
    dynamicBuilder,
  )

  const getPallet = (name: string) =>
    metadata.pallets.find((p) => p.name === name)

  const target = {}
  const createProxy = (propCall: (prop: string) => unknown) =>
    new Proxy(target, {
      get(_, prop) {
        return propCall(prop as string)
      },
    })

  const createProxyPath = <T>(pathCall: (a: string, b: string) => T) => {
    const cache: Record<string, Record<string, T>> = {}
    return createProxy((a) => {
      if (!cache[a]) cache[a] = {}
      return createProxy((b) => {
        if (!cache[a][b]) cache[a][b] = pathCall(a, b)
        return cache[a][b]
      })
    }) as Record<string, Record<string, T>>
  }

  const constants = createProxyPath((pallet, name) => {
    const constant = getPallet(pallet)?.constants.find((c) => c.name === name)
    if (!constant)
      throw new Error(`Runtime entry Constant(${pallet}.${name}) not found`)
    return dynamicBuilder.buildConstant(pallet, name).dec(constant.value)
  })

  const tx = createProxyPath((pallet, name) =>
    createOfflineTxEntry(
      pallet,
      name,
      metadataRaw,
      dynamicBuilder,
      signExtensionCreator,
    ),
  )

  return { constants, tx } as any
}
