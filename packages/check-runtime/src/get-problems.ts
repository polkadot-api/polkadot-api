import { Binary, type HexString } from "polkadot-api"
import {
  decAnyMetadata,
  unifyMetadata,
  type UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata"
import { toHex } from "polkadot-api/utils"
import { lastValueFrom, takeWhile } from "rxjs"
import { withMetadataHash } from "./with-metadata-hash"
import { alice } from "./alice"
import { getChopsticksClient } from "./chopsticks"
import { Problem } from "./problems"

const DEV_APIS = ["TryRuntime", "Benchmark"]

export const getProblems = async (
  uri: string,
  options: Partial<{
    wasm: HexString
    block: HexString | number
    token: Partial<{
      symbol: string
      decimals: number
    }>
  }> = {},
): Promise<Array<Problem>> => {
  let client: Awaited<ReturnType<typeof getChopsticksClient>> | undefined =
    undefined
  let metadata: UnifiedMetadata
  let metadataRaw: Uint8Array

  try {
    client = await getChopsticksClient(uri, options)
    metadataRaw = await client.getMetadata(
      (await client.getFinalizedBlock()).hash,
    )
    metadata = unifyMetadata(decAnyMetadata(metadataRaw))
  } catch {
    try {
      client?.destroy()
    } catch {}
    return [Problem.ANCIENT_METADATA]
  }
  try {
    if (metadata.version < 15) return [Problem.MISSING_MODERN_METADATA]

    const problems: Array<Problem> = []
    if (!metadata.apis.length) problems.push(Problem.MISSING_RUNTIME_APIS)
    else if (
      metadata.apis.some((x) => DEV_APIS.includes(x.name) && x.methods.length)
    )
      problems.push(Problem.DEV_APIS_PRESENT)

    let { symbol, decimals } = options.token ?? {}

    if (!symbol || decimals === undefined) {
      const {
        properties: { tokenSymbol, tokenDecimals },
      } = await client.getChainSpecData()
      symbol ||= tokenSymbol
      decimals = decimals === undefined ? tokenDecimals : decimals
    }

    const merkelizerProps = {
      decimals: decimals!,
      tokenSymbol: symbol!,
    }

    const getDiggest = (input: Uint8Array) =>
      toHex(merkleizeMetadata(input, merkelizerProps).digest())

    if (metadata.version === 16) {
      const rawMetadata15 = (await client.api.apis.Metadata.metadata_at_version(
        15,
      ))!.asBytes()
      const diggest15 = getDiggest(rawMetadata15)
      const diggest16 = getDiggest(metadataRaw)

      if (diggest15 !== diggest16) {
        problems.push(Problem.DIFFERENT_METADATA_HASHES)
        metadataRaw = rawMetadata15
      }
    }

    if (
      !metadata.extrinsic.signedExtensions.some(
        (s) => s.identifier === "CheckMetadataHash",
      )
    ) {
      problems.push(Problem.MISSING_CHECK_METADATA_HASH_EXTENSION)
    }

    try {
      await lastValueFrom(
        client.api.tx.System.remark({
          remark: Binary.fromText("PAPI Rocks!"),
        })
          .signSubmitAndWatch(
            withMetadataHash(alice, merkelizerProps, metadataRaw),
          )
          .pipe(takeWhile((e) => e.type !== "broadcasted")),
      )
    } catch {
      problems.push(Problem.WRONG_OR_MISSING_METADATA_HASH)
    }

    return problems
  } finally {
    client.destroy()
  }
}
