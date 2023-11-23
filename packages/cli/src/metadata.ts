import { WellKnownChain } from "@substrate/connect"
import { createClient } from "@polkadot-api/substrate-client"
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import { deferred } from "./deferred"
import { fromHex } from "@polkadot-api/utils"
import * as fs from "node:fs/promises"
import {
  metadata as $metadata,
  CodecType,
  OpaqueCodec,
} from "@polkadot-api/substrate-bindings"
import { PROVIDER_WORKER_CODE } from "./smolldot-worker"
import { Worker } from "node:worker_threads"

type Metadata = ReturnType<typeof $metadata.dec>["metadata"]

async function getChainMetadata(chain: WellKnownChain): Promise<Uint8Array> {
  const provider: ConnectProvider = (onMsg) => {
    let worker: Worker | null = new Worker(PROVIDER_WORKER_CODE, {
      eval: true,
      workerData: chain,
      stderr: true,
      stdout: true,
    })
    worker.on("message", onMsg)

    return {
      send: (msg) => worker?.postMessage({ type: "send", value: msg }),
      disconnect: () => {
        if (!worker) return

        worker.postMessage({ type: "disconnect" })
        worker.removeAllListeners()
        worker.terminate()
        worker = null
      },
    }
  }

  const { chainHead, destroy } = createClient(provider)

  const blockHashDeferred = deferred<string>()
  const chainHeadFollower = chainHead(
    true,
    (event) => {
      switch (event.type) {
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
  destroy()

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

  const { magicNumber, metadata } = inner()

  assertIsv14(metadata)

  return { magicNumber, metadata }
}

function assertIsv14(
  metadata: Metadata,
): asserts metadata is Metadata & { tag: "v14" } {
  if (metadata.tag !== "v14") {
    throw new Error("unreachable")
  }
}
