import { dotAh } from "@polkadot-api/descriptors"
import { Binary, createClient, Enum } from "polkadot-api"
import { firstValueFrom, shareReplay } from "rxjs"
import { describe, expect, it } from "vitest"
import { getForkliftProvider } from "./lib/forklift"
import { getDevSigner } from "./lib/signer"

const aliceSigner = getDevSigner("//Alice")

const getMacroTask = () => new Promise((res) => setTimeout(res, 0))

describe("tx", () => {
  it('notifies users about "stolen" transactions', async () => {
    const [provider, forklift] = getForkliftProvider("tx_sub", {
      finalizeMode: Enum("manual"),
      buildBlockMode: Enum("manual"),
    })

    const client = createClient(provider)
    const api = client.getTypedApi(dotAh)

    const [bestBlock] = await client.getBestBlocks()
    const tx = await api.tx.System.remark({
      remark: Binary.fromText("hi!"),
    }).create(aliceSigner)

    const obs = client.submitAndWatch(tx).pipe(shareReplay(1))
    const sub = obs.subscribe()

    await forklift.newBlock({
      parent: bestBlock.hash,
      transactions: [tx],
    })
    await getMacroTask()

    let latestEvent = await firstValueFrom(obs)
    expect(latestEvent.type === "txBestBlocksState" && latestEvent.found).toBe(
      true,
    )

    const forkedBlock = await forklift.newBlock({
      parent: bestBlock.hash,
      transactions: [],
    })
    await getMacroTask()

    await forklift.newBlock({
      parent: forkedBlock,
      transactions: [],
    })
    await getMacroTask()

    latestEvent = await firstValueFrom(obs)
    expect(latestEvent.type === "txBestBlocksState" && !latestEvent.found).toBe(
      true,
    )

    sub.unsubscribe()
  })
})
