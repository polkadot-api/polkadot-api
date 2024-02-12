import { WellKnownChain } from "@substrate/connect"
import { createClient } from "@polkadot-api/substrate-client"
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import * as fs from "node:fs/promises"
import { V15, v15 } from "@polkadot-api/substrate-bindings"
import { PROVIDER_WORKER_CODE } from "./smolldot-worker"
import { Worker } from "node:worker_threads"
import { WebSocketProvider } from "./websocket-provider"
import { getObservableClient } from "@polkadot-api/client"
import { filter, firstValueFrom } from "rxjs"

const getMetadataCall = async (provider: ConnectProvider) => {
  const client = getObservableClient(createClient(provider))
  const { metadata$, unfollow } = client.chainHead$()
  const metadata = await firstValueFrom(metadata$.pipe(filter(Boolean)))

  unfollow()
  client.destroy()

  return metadata
}

const getMetadataFromWellKnownChain = async (chain: WellKnownChain) => {
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

export type GetMetadataArgs =
  | {
      source: "chain"
      chain: WellKnownChain
    }
  | {
      source: "ws"
      url: string
    }
  | {
      source: "file"
      file: string
    }

export async function getMetadata(args: GetMetadataArgs): Promise<V15> {
  switch (args.source) {
    case "chain": {
      return getMetadataFromWellKnownChain(args.chain)
    }
    case "ws": {
      return getMetadataFromWsURL(args.url)
    }
    case "file": {
      const data = await fs.readFile(args.file)
      return v15.dec(data)
    }
  }
}
