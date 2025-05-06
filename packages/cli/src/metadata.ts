import { createClient } from "@polkadot-api/substrate-client"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import * as fs from "node:fs/promises"
import {
  HexString,
  metadata,
  NormalizedMetadata,
  normalizeMetadata,
  v15,
} from "@polkadot-api/substrate-bindings"
import { getWsProvider } from "@polkadot-api/ws-provider/node"
import { Worker } from "node:worker_threads"
import { getObservableClient } from "@polkadot-api/observable-client"
import { combineLatest, filter, firstValueFrom } from "rxjs"
import { EntryConfig } from "./papiConfig"
import { dirname } from "path"
import { fileURLToPath } from "url"
import * as knownChains from "@polkadot-api/known-chains"
import { withPolkadotSdkCompat } from "@polkadot-api/polkadot-sdk-compat"
import { startFromWorker } from "@polkadot-api/smoldot/from-node-worker"
import { Client as SmoldotClient } from "@polkadot-api/smoldot"
import { getSmProvider } from "@polkadot-api/sm-provider"

const workerPath = fileURLToPath(
  import.meta.resolve("@polkadot-api/smoldot/node-worker"),
)

let smoldotWorker: [SmoldotClient, Worker] | null
let workerRefCount = 0
async function getSmoldotWorker() {
  if (!smoldotWorker) {
    const worker = new Worker(workerPath, {
      stdout: true,
      stderr: true,
    })
    const client = startFromWorker(worker)
    smoldotWorker = [client, worker]
  }
  return smoldotWorker
}

const getMetadataCall = async (provider: JsonRpcProvider) => {
  const client = getObservableClient(createClient(provider))
  const { runtime$, unfollow, genesis$ } = client.chainHead$()
  const { runtime, genesis } = await firstValueFrom(
    combineLatest({
      runtime: runtime$.pipe(filter(Boolean)),
      genesis: genesis$,
    }),
  )

  unfollow()
  client.destroy()

  return {
    metadata: runtime.lookup.metadata,
    metadataRaw: runtime.metadataRaw,
    genesis,
  }
}

const getChainSpecs = (
  chain: string,
): { potentialRelayChainSpecs: string[]; chainSpec: string } => {
  if (!(chain in knownChains)) {
    const relayChainName = JSON.parse(chain).relay_chain
    return {
      potentialRelayChainSpecs:
        relayChainName in knownChains
          ? [knownChains[relayChainName as keyof typeof knownChains]]
          : [],
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

const getMetadataFromSmoldot = async (chain: string) => {
  workerRefCount++
  try {
    const [smoldot] = await getSmoldotWorker()
    const chainSpecs = getChainSpecs(chain)
    const potentialRelayChains = await Promise.all(
      chainSpecs.potentialRelayChainSpecs.map((chainSpec) =>
        smoldot.addChain({ chainSpec }),
      ),
    )
    const provider = getSmProvider(
      smoldot.addChain({
        chainSpec: chainSpecs.chainSpec,
        potentialRelayChains,
      }),
    )
    return await getMetadataCall(provider)
  } finally {
    workerRefCount--
    if (workerRefCount === 0) {
      const [smoldot, worker] = smoldotWorker!
      smoldotWorker = null
      await smoldot.terminate()
      await worker.terminate()
    }
  }
}

const getMetadataFromWsURL = async (wsURL: string) =>
  getMetadataCall(withPolkadotSdkCompat(getWsProvider(wsURL)))

export async function getMetadata(entry: EntryConfig): Promise<{
  metadata: NormalizedMetadata
  metadataRaw: Uint8Array
  genesis?: HexString
} | null> {
  // metadata file always prevails over other entries.
  // cli's update will update the metadata file when the user requests it.
  if (entry.metadata) {
    const data = await fs.readFile(entry.metadata)
    const metadataRaw = new Uint8Array(data)

    let meta: NormalizedMetadata
    try {
      meta = normalizeMetadata(metadata.dec(metadataRaw))
    } catch (_) {
      meta = normalizeMetadata(v15.dec(metadataRaw))
    }

    return {
      metadata: meta,
      metadataRaw,
      genesis: entry.genesis,
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
