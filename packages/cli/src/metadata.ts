import { createClient } from "@polkadot-api/substrate-client"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import * as fs from "node:fs/promises"
import { V14, V15, metadata, v15 } from "@polkadot-api/substrate-bindings"
import { WebSocketProvider } from "@polkadot-api/ws-provider/node"
import { PROVIDER_WORKER_CODE } from "./smolldot-worker"
import { Worker } from "node:worker_threads"
import { getObservableClient } from "@polkadot-api/observable-client"
import { filter, firstValueFrom } from "rxjs"
import { EntryConfig } from "./papiConfig"
import { dirname } from "path"
import { WellKnownChain } from "./well-known-chains"

const getMetadataCall = async (provider: JsonRpcProvider) => {
  const client = getObservableClient(createClient(provider))
  const { runtime$, unfollow } = client.chainHead$()
  const runtime = await firstValueFrom(runtime$.pipe(filter(Boolean)))

  unfollow()
  client.destroy()

  return { metadata: runtime.metadata, metadataRaw: runtime.metadataRaw }
}

const getMetadataFromProvider = async (chain: WellKnownChain | string) => {
  const provider: JsonRpcProvider = (onMsg) => {
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

  return getMetadataCall(provider)
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
    return getMetadataFromProvider(entry.chain)
  }

  if ("chainSpec" in entry) {
    const chainSpec = await fs.readFile(entry.chainSpec, "utf8")
    return getMetadataFromProvider(chainSpec)
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
