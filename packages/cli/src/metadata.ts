import { createClient } from "@polkadot-api/substrate-client"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import * as fs from "node:fs/promises"
import { V14, V15, metadata, v15 } from "@polkadot-api/substrate-bindings"
import { WebSocketProvider } from "@polkadot-api/ws-provider/node"
import { Worker } from "node:worker_threads"
import { getObservableClient } from "@polkadot-api/observable-client"
import { filter, firstValueFrom } from "rxjs"
import { EntryConfig } from "./papiConfig"
import { dirname } from "path"
import { fileURLToPath } from "url"
import * as knownChains from "@polkadot-api/known-chains"
import type {
  MetadataWithRaw,
  WorkerRequestMessage,
  WorkerResponseMessage,
} from "./metadataWorker"

const workerPath = fileURLToPath(import.meta.resolve("./metadataWorker.js"))

let metadataWorker: Worker | null
let workerRefCount = 0
async function getMetadataWorker() {
  if (!metadataWorker) {
    metadataWorker = new Worker(workerPath, {
      stdout: true,
      stderr: true,
    })
    await new Promise((resolve) => {
      metadataWorker?.once("message", resolve)
      metadataWorker?.postMessage("ready")
    })
  }
  return metadataWorker
}

const getMetadataCall = async (provider: JsonRpcProvider) => {
  const client = getObservableClient(createClient(provider))
  const { runtime$, unfollow } = client.chainHead$()
  const runtime = await firstValueFrom(runtime$.pipe(filter(Boolean)))

  unfollow()
  client.destroy()

  return { metadata: runtime.metadata, metadataRaw: runtime.metadataRaw }
}

const getWorkerMessage = (chain: string): Omit<WorkerRequestMessage, "id"> => {
  if (!(chain in knownChains)) {
    return {
      potentialRelayChainSpecs: [],
      chainSpec: chain,
    }
  }
  const relayChainName = Object.keys(knownChains).find(
    (c) => c !== chain && chain.startsWith(c),
  )
  const potentialRelayChainSpecs = relayChainName
    ? [knownChains[relayChainName as keyof typeof knownChains]]
    : []
  const chainSpec = knownChains[chain as keyof typeof knownChains]

  return {
    potentialRelayChainSpecs,
    chainSpec,
  }
}

let id = 0
const getMetadataFromSmoldot = async (chain: string) => {
  workerRefCount++
  try {
    const reqId = id++
    const metadataWorker = await getMetadataWorker()
    const message: WorkerRequestMessage = {
      ...getWorkerMessage(chain),
      id: reqId,
    }
    const metadata = await new Promise<MetadataWithRaw>((resolve) => {
      const listener = (data: WorkerResponseMessage) => {
        if (data.id !== reqId) return
        metadataWorker.off("message", listener)
        resolve(data.metadata)
      }
      metadataWorker.on("message", listener)
      metadataWorker.postMessage(message)
    })
    return metadata
  } finally {
    workerRefCount--
    if (workerRefCount === 0) {
      metadataWorker?.terminate()
      metadataWorker = null
    }
  }
}

const getMetadataFromWsURL = async (wsURL: string) =>
  getMetadataCall(WebSocketProvider(wsURL))

export async function getMetadata(
  entry: EntryConfig,
): Promise<{ metadata: V15 | V14; metadataRaw: Uint8Array } | null> {
  // metadata file always prevails over other entries.
  // cli's update will update the metadata file when the user requests it.
  if (entry.metadata) {
    const data = await fs.readFile(entry.metadata)
    const metadataRaw = new Uint8Array(data)

    let meta: V14 | V15
    try {
      meta = metadata.dec(metadataRaw).metadata.value as V14 | V15
    } catch (_) {
      meta = v15.dec(metadataRaw)
    }

    return {
      metadata: meta,
      metadataRaw,
    }
  }

  if ("chain" in entry) {
    return getMetadataFromSmoldot(entry.chain)
  }

  if ("chainSpec" in entry) {
    const chainSpec = await fs.readFile(entry.chainSpec, "utf8")
    return getMetadataFromSmoldot(chainSpec)
  }

  if ("wsUrl" in entry) {
    return getMetadataFromWsURL(entry.wsUrl)
  }

  return null
}

export async function writeMetadataToDisk(
  metadataRaw: Uint8Array,
  outFile: string,
) {
  await fs.mkdir(dirname(outFile), { recursive: true })
  await fs.writeFile(outFile, metadataRaw)
}
