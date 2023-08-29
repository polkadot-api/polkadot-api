import { WellKnownChain } from "@substrate/connect"
import { createClient } from "@unstoppablejs/substrate-client"
import { ScProvider } from "@unstoppablejs/sc-provider"
import { deferred } from "./deferred"
import { fromHex } from "@unstoppablejs/utils"
import * as fs from "node:fs/promises"
import {
  metadata as $metadata,
  OpaqueCodec,
} from "@unstoppablejs/substrate-bindings"

type Metadata = ReturnType<typeof $metadata.dec>["metadata"]

async function getChainMetadata(chain: WellKnownChain): Promise<Uint8Array> {
  const provider = ScProvider(chain)
  const { chainHead } = createClient(provider)

  const blockHashDeferred = deferred<string>()
  const chainHeadFollower = chainHead(
    true,
    (event) => {
      switch (event.event) {
        case "finalized":
          blockHashDeferred.resolve(
            event.finalizedBlockHashes[event.finalizedBlockHashes.length - 1],
          )
          break
        default:
          break
      }
    },
    console.error,
  )

  const blockHash = await blockHashDeferred

  const metadata = fromHex(
    await chainHeadFollower.call(blockHash, "Metadata_metadata", ""),
  )
  chainHeadFollower.unfollow()

  return metadata
}

export type GetMetadataArgs =
  | {
      source: "chain"
      chain: WellKnownChain
    }
  | {
      source: "file"
      file: string
    }

async function getRawMetadata(args: GetMetadataArgs): Promise<Uint8Array> {
  switch (args.source) {
    case "chain": {
      return getChainMetadata(args.chain)
    }
    case "file": {
      return fs.readFile(args.file)
    }
  }
}

export async function getMetadata(args: GetMetadataArgs) {
  const rawMetadata = await getRawMetadata(args)
  const { inner } = OpaqueCodec($metadata).dec(rawMetadata)

  const { metadata } = inner()

  assertIsv14(metadata)

  return metadata
}

function assertIsv14(
  metadata: Metadata,
): asserts metadata is Metadata & { tag: "v14" } {
  if (metadata.tag !== "v14") {
    throw new Error("unreachable")
  }
}
