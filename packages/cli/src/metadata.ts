import { createClient } from "@polkadot-api/substrate-client"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import * as fs from "node:fs/promises"
import {
  Blake2256,
  HexString,
  metadata,
  UnifiedMetadata,
  unifyMetadata,
  v15,
} from "@polkadot-api/substrate-bindings"
import { getWsProvider } from "@polkadot-api/ws-provider/node"
import { Worker } from "node:worker_threads"
import { getObservableClient } from "@polkadot-api/observable-client"
import {
  catchError,
  combineLatest,
  concatMap,
  filter,
  firstValueFrom,
  from,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  timer,
} from "rxjs"
import { EntryConfig } from "./papiConfig"
import { dirname } from "path"
import { fileURLToPath } from "url"
import * as knownChains from "@polkadot-api/known-chains"
import { withPolkadotSdkCompat } from "@polkadot-api/polkadot-sdk-compat"
import { startFromWorker } from "@polkadot-api/smoldot/from-node-worker"
import { Client as SmoldotClient } from "@polkadot-api/smoldot"
import { getSmProvider } from "@polkadot-api/sm-provider"
import { withLegacy } from "@polkadot-api/legacy-provider"
import { keccak_256 } from "@noble/hashes/sha3"

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

type GetMetadataPayload = {
  metadata: UnifiedMetadata
  metadataRaw: Uint8Array
  codeHash: string
  genesis: string
}
const getMetadataCall = (provider: JsonRpcProvider, at?: string) =>
  new Observable<GetMetadataPayload>((observer) => {
    const substrateClient = createClient(provider)
    const client = getObservableClient(substrateClient)
    const { runtime$, unfollow, genesis$, getRuntime$ } = client.chainHead$()
    const archive = client.archive(getRuntime$)

    const getRuntimeCtx$ = () => {
      if (!at) return runtime$.pipe(filter(Boolean))
      // if it's a number
      const hash$ =
        at.length < 32 && /^\d+$/.test(at)
          ? from(substrateClient.archive.hashByHeight(Number(at))).pipe(
              map(([hash]) => {
                if (!hash) {
                  throw new Error(`Can't find block number "${at}"`)
                }
                return hash
              }),
            )
          : of(at)
      return hash$.pipe(switchMap(archive.getRuntimeContext$))
    }

    const subscription = combineLatest({
      runtime: getRuntimeCtx$(),
      genesis: genesis$,
    })
      .pipe(
        take(1),
        map(
          ({
            runtime: {
              lookup: { metadata },
              metadataRaw,
              codeHash,
            },
            genesis,
          }) => ({
            metadata,
            metadataRaw,
            codeHash,
            genesis,
          }),
        ),
      )
      .subscribe(observer)

    subscription.add(() => {
      try {
        unfollow()
        client.destroy()
      } catch {}
    })

    return subscription
  })

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
    return await firstValueFrom(getMetadataCall(provider))
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

const getMetadataCallWithError = (
  ...input: Parameters<typeof getMetadataCall>
) =>
  getMetadataCall(...input).pipe(
    map((value) => ({ success: true as const, value })),
    catchError((error) => of({ success: false as const, error })),
  )

const getMetadataFromWsURL = (wsURL: string, at?: string) =>
  firstValueFrom(
    merge(
      getMetadataCallWithError(withPolkadotSdkCompat(getWsProvider(wsURL)), at),
      timer(3_000).pipe(
        concatMap(() =>
          merge(
            ...[Blake2256, keccak_256].map((hasher) =>
              getMetadataCallWithError(
                getWsProvider({
                  endpoints: [wsURL],
                  innerEnhancer: withLegacy(hasher),
                }),
                at,
              ),
            ),
          ),
        ),
      ),
    ).pipe(
      mergeMap((x, idx) => {
        if (x.success) return [x.value]
        if (idx < 2) return []
        throw x.error
      }),
    ),
  )

export async function getMetadata({
  metadata: metadataFile,
  codeHash,
  genesis,
  ...entry
}: EntryConfig): Promise<{
  metadata: UnifiedMetadata
  metadataRaw: Uint8Array
  codeHash?: HexString
  genesis?: HexString
} | null> {
  // metadata file always prevails over other entries.
  // cli's update will update the metadata file when the user requests it.
  if (metadataFile) {
    const data = await fs.readFile(metadataFile)
    const metadataRaw = new Uint8Array(data)

    let meta: UnifiedMetadata
    try {
      meta = unifyMetadata(metadata.dec(metadataRaw))
    } catch (_) {
      meta = unifyMetadata(v15.dec(metadataRaw))
    }

    return {
      metadata: meta,
      metadataRaw,
      codeHash,
      genesis,
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
    return getMetadataFromWsURL(entry.wsUrl, entry.at)
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
