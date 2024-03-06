import { WellKnownChain } from "@substrate/connect"
import { createClient } from "@polkadot-api/substrate-client"
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import * as fs from "node:fs/promises"
import { V15, v15 } from "@polkadot-api/substrate-bindings"
import { WebSocketProvider } from "@polkadot-api/ws-provider/node"
import { PROVIDER_WORKER_CODE } from "./smolldot-worker"
import { Worker } from "node:worker_threads"
import { getObservableClient } from "@polkadot-api/client"
import { filter, firstValueFrom } from "rxjs"
import { EntryConfig } from "./papiConfig"
import { dirname } from "path"

const getMetadataCall = async (provider: ConnectProvider) => {
  const client = getObservableClient(createClient(provider))
  const { metadata$, unfollow } = client.chainHead$()
  const metadata = await firstValueFrom(metadata$.pipe(filter(Boolean)))

  unfollow()
  client.destroy()

  return metadata
}

const getMetadataFromProvider = async (chain: WellKnownChain | string) => {
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

  return getMetadataCall(provider)
}

const getMetadataFromWsURL = async (wsURL: string) =>
  getMetadataCall(WebSocketProvider(wsURL))

export async function getMetadata(entry: EntryConfig): Promise<V15 | null> {
  // metadata file always prevails over other entries.
  // cli's update will update the metadata file when the user requests it.
  if (entry.metadata) {
    const data = await fs.readFile(entry.metadata)
    return v15.dec(data)
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

export async function writeMetadataToDisk(metadata: V15, outFile: string) {
  const encoded = v15.enc(metadata)

  await fs.mkdir(dirname(outFile), { recursive: true })
  await fs.writeFile(outFile, encoded)
}
