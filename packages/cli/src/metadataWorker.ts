import { parentPort } from "node:worker_threads"
import { start } from "@polkadot-api/smoldot"
import { getSmProvider } from "@polkadot-api/sm-provider"
import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getObservableClient } from "@polkadot-api/observable-client"
import { createClient } from "@polkadot-api/substrate-client"
import { firstValueFrom, filter } from "rxjs"

export type WorkerRequestMessage = {
  id: number
  potentialRelayChainSpecs: string[]
  chainSpec: string
}
export type WorkerResponseMessage = {
  id: number
  metadata: MetadataWithRaw
}

const smoldot = start()
parentPort!.on("message", async (data: WorkerRequestMessage | "ready") => {
  if (data === "ready") {
    parentPort!.postMessage("ready")
    return
  }

  const potentialRelayChains = await Promise.all(
    data.potentialRelayChainSpecs.map((chainSpec) =>
      smoldot.addChain({ chainSpec }),
    ),
  )
  const chain = await smoldot.addChain({
    potentialRelayChains,
    chainSpec: data.chainSpec,
  })
  const metadata = await getMetadataFromProvider(getSmProvider(chain))
  const response: WorkerResponseMessage = {
    metadata,
    id: data.id,
  }
  parentPort!.postMessage(response)
})
parentPort!.postMessage("ready")

async function getMetadataFromProvider(provider: JsonRpcProvider) {
  const client = getObservableClient(createClient(provider))
  const { runtime$, unfollow } = client.chainHead$()
  const runtime = await firstValueFrom(runtime$.pipe(filter(Boolean)))

  unfollow()
  client.destroy()

  return { metadata: runtime.lookup.metadata, metadataRaw: runtime.metadataRaw }
}
export type MetadataWithRaw = Awaited<
  ReturnType<typeof getMetadataFromProvider>
>
