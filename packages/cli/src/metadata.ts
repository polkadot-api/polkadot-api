import { WellKnownChain } from "@substrate/connect"
import { createClient } from "@polkadot-api/substrate-client"
import { GetProvider } from "@unstoppablejs/provider"
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
import { Subject } from "rxjs"
import { z } from "zod"

type Metadata = ReturnType<typeof $metadata.dec>["metadata"]

async function getChainMetadata(chain: WellKnownChain): Promise<Uint8Array> {
  const worker = new Worker(PROVIDER_WORKER_CODE, {
    eval: true,
    workerData: chain,
    stderr: true,
    stdout: true,
  })

  const onMsgSubject = new Subject<string>()
  const onStatusSubject = new Subject<0 | 1 | 2>()

  const msgSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("message"), value: z.string() }),
    z.object({
      type: z.literal("status"),
      value: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    }),
  ])

  worker.on("message", (msg) => {
    const parsedMsg = msgSchema.parse(msg)
    switch (parsedMsg.type) {
      case "message":
        onMsgSubject.next(parsedMsg.value)
        break
      case "status":
        onStatusSubject.next(parsedMsg.value)
        break
      default:
        break
    }
  })

  const provider: GetProvider = (onMsg, onStatus) => {
    onMsgSubject.subscribe((msg) => onMsg(msg))
    onStatusSubject.subscribe((status) => onStatus(status))

    return {
      send: (msg) => worker.postMessage({ type: "send", value: msg }),
      open: () => worker.postMessage({ type: "open" }),
      close: () => worker.postMessage({ type: "close" }),
    }
  }

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
  await worker.terminate()

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

export function encodeMetadata(metadata: CodecType<typeof $metadata>) {
  const encodedMetadata = $metadata.enc(metadata)

  return OpaqueCodec($metadata).enc({
    length: encodedMetadata.length,
    inner: () => metadata,
  })
}

function assertIsv14(
  metadata: Metadata,
): asserts metadata is Metadata & { tag: "v14" } {
  if (metadata.tag !== "v14") {
    throw new Error("unreachable")
  }
}
