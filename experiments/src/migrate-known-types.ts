import { getBundledKnownTypes } from "@polkadot-api/codegen"
import { getChecksumBuilder } from "@polkadot-api/metadata-builders"
import { getSmProvider } from "@polkadot-api/sm-provider"
import { mapObject } from "@polkadot-api/utils"
import {
  ksmcc3,
  polkadot,
  rococo_v2_2,
  westend2,
  ksmcc3_asset_hub,
  polkadot_asset_hub,
  rococo_v2_2_asset_hub,
  westend2_asset_hub,
  ksmcc3_bridge_hub,
  polkadot_bridge_hub,
  rococo_v2_2_bridge_hub,
  westend2_bridge_hub,
  polkadot_collectives,
  westend2_collectives,
} from "@substrate/connect-known-chains"
import { start } from "smoldot"
import { getMetadataFromProvider } from "./getMetadata"
import { readFile, writeFile } from "node:fs/promises"
import { V15 } from "@polkadot-api/substrate-bindings"

const chains = {
  dot: [polkadot],
  ksm: [ksmcc3],
  wnd: [westend2],
  roc: [rococo_v2_2],
  ksm_ah: [ksmcc3_asset_hub, ksmcc3],
  dot_ah: [polkadot_asset_hub, polkadot],
  roc_ah: [rococo_v2_2_asset_hub, rococo_v2_2],
  wnd_ah: [westend2_asset_hub, westend2],
  ksm_bh: [ksmcc3_bridge_hub, ksmcc3],
  dot_bh: [polkadot_bridge_hub, polkadot],
  roc_bh: [rococo_v2_2_bridge_hub, rococo_v2_2],
  wnd_bh: [westend2_bridge_hub, westend2],
  dot_col: [polkadot_collectives, polkadot],
  wnd_col: [westend2_collectives, westend2],
} as Record<string, string[]>

const STEP: number = 3

const getMetadataPath = (key: string) => "migration/" + key + ".json"
const mapPath = "migration/map.json"
const knownTypesFile = "migration/known-types.ts"

// STEP 1
async function getMetadatas() {
  const metadatas = mapObject(chains, async (chainGroup) => {
    const smoldot = start()

    const [chain, relayChain] = chainGroup
    const potentialRelayChains = relayChain
      ? [await smoldot.addChain({ chainSpec: relayChain })]
      : undefined

    const result = await getMetadataFromProvider(
      getSmProvider(
        smoldot.addChain({
          chainSpec: chain,
          potentialRelayChains,
        }),
      ),
    )
    smoldot.terminate()
    return result
  })

  const getNextMetadata = async (): Promise<
    [string, Awaited<ReturnType<typeof getMetadataFromProvider>>] | null
  > => {
    const promises = Object.entries(metadatas).map(
      async ([key, promise]) =>
        [
          key,
          await promise.catch((err) => {
            delete metadatas[key]
            console.error(key + " errored", err)
            throw err
          }),
        ] as const,
    )

    if (!Object.keys(metadatas).length) return null
    try {
      const [key, metadata] = await Promise.race(promises)
      delete metadatas[key]
      console.log(key + " resolved. Missing:", Object.keys(metadatas))
      return [key, metadata] as const
    } catch (ex) {
      return getNextMetadata()
    }
  }

  while (Object.keys(metadatas).length) {
    const [key, result] = (await getNextMetadata())!
    await writeFile(getMetadataPath(key), JSON.stringify(result.metadata.value))
    console.log("missing", Object.keys(metadatas))
  }
}
if (STEP === 1) {
  await getMetadatas()
}

// STEP 2
async function getCurrentKnownTypes() {
  const metadatas = Object.entries(
    mapObject(chains, (_, key) =>
      readFile(getMetadataPath(key), "utf-8").then((r) => {
        try {
          return JSON.parse(r) as V15
        } catch (ex) {
          console.error(key, ex)
          throw ex
        }
      }),
    ),
  )

  const bundledKnownTypes = getBundledKnownTypes()
  const missingChecksums = new Set(
    Array.from(bundledKnownTypes.keys()).filter((key) => !key.includes(",")),
  )

  // checksum => [chain, idx]
  const result: Record<string, [string, number]> = {}

  for (let i = 0; i < metadatas.length; i++) {
    const [key, metadata] = [metadatas[i][0], await metadatas[i][1]]
    const builder = getChecksumBuilder(metadata)
    for (let idx = 0; idx < metadata.lookup.length; idx++) {
      const checksum = builder.buildDefinition(idx)!

      if (!missingChecksums.has(checksum)) continue
      missingChecksums.delete(checksum)

      const knownType = bundledKnownTypes.get(checksum)
      if (knownType) {
        result[checksum] = [key, idx]
      }
    }

    if (missingChecksums.size === 0) break
  }

  await writeFile(mapPath, JSON.stringify(result))
}

if (STEP === 2) {
  await getCurrentKnownTypes()
}

// STEP 3
async function refreshTypes() {
  let knownTypes = await readFile(knownTypesFile, "utf-8")
  const checksumMap = JSON.parse(await readFile(mapPath, "utf-8")) as Record<
    string,
    [string, number]
  >
  const bundledKnownTypes = getBundledKnownTypes()
  const paths = new Set(
    Array.from(bundledKnownTypes.keys()).filter((key) => key.includes(",")),
  )

  const metadatas = mapObject(chains, (_, key) =>
    readFile(getMetadataPath(key), "utf-8").then((r) => {
      try {
        return JSON.parse(r) as V15
      } catch (ex) {
        console.error(key, ex)
        throw ex
      }
    }),
  )
  const checksumBuilders = mapObject(metadatas, (metadata) =>
    metadata.then(getChecksumBuilder),
  )

  for (const entry of Object.entries(checksumMap)) {
    const [checksum, [key, idx]] = entry
    const newChecksum = (await checksumBuilders[key]).buildDefinition(idx)
    if (!newChecksum) throw new Error("Unreachable")

    const path = (await metadatas[key]).lookup[idx].path.join(",")
    paths.delete(path)
    knownTypes = knownTypes.replaceAll(checksum, newChecksum)
  }

  // Try to find missing paths
  for (const key of Object.keys(metadatas)) {
    const metadata = await metadatas[key]
    const builder = await checksumBuilders[key]
    for (let idx = 0; idx < metadata.lookup.length; idx++) {
      const path = metadata.lookup[idx].path.join(",")
      if (!paths.has(path)) continue
      paths.delete(path)

      const checksum = builder.buildDefinition(idx)!
      const oldChecksum = bundledKnownTypes.get(path)
      if (oldChecksum && checksum !== oldChecksum) {
        knownTypes = knownTypes.replaceAll(oldChecksum, checksum)
      }
    }
  }

  await writeFile(knownTypesFile, knownTypes)
}

if (STEP === 3) {
  await refreshTypes()
}

process.exit(0)
