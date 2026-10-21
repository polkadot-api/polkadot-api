import { dotAh } from "@polkadot-api/descriptors"
import { Binary, createClient, Enum } from "polkadot-api"
import { filter, firstValueFrom, mergeMap, Subscription } from "rxjs"
import { describe, expect, it } from "vitest"
import { getForkliftProvider } from "./lib/forklift"
import { observe } from "./lib/observe"
import { getDevSigner } from "./lib/signer"

// https://github.com/polkadot-api/polkadot-api/issues/1459
describe("querying finalized blocks", () => {
  it("can query every block in a finality batch when its first block contains a tracked transaction", async () => {
    const [provider, chain] = getForkliftProvider("finalized_block_hold", {
      buildBlockMode: Enum("manual"),
      finalizeMode: Enum("manual"),
      logger: null,
      rpcOverrides: {
        archive_v1_storage: null,
      },
    })

    const client = createClient(provider)
    const api = client.getTypedApi(dotAh)
    const subscriptions = new Subscription()
    const holdErrors: { hash: string; error: unknown }[] = []
    const eventReads: Promise<unknown>[] = []

    try {
      // Subscribe before tracking the transaction. Hold synchronously in next,
      // then release after reading events, just like the issue's follower.
      const finalized = observe(
        client.finalizedBlock$.pipe(
          mergeMap(async ({ hash }) => {
            try {
              await api.query.System.Events.getValue({
                at: hash,
              })
            } catch (error) {
              // Keep following so a failed hold is an assertion failure rather
              // than an unhandled RxJS error or a timeout waiting for the tip.
              holdErrors.push({ hash, error })
            }
            return { hash }
          }),
        ),
      )
      subscriptions.add(finalized.unsubscribe)
      const initialFinalized = await client.getFinalizedBlock()

      const tx = await api.tx.System.remark({
        remark: Binary.fromText("issue 1459"),
      }).create(getDevSigner())
      const tracked = observe(client.submitAndWatch(tx))
      subscriptions.add(tracked.unsubscribe)
      await firstValueFrom(
        tracked.replay$.pipe(filter((event) => event.type === "broadcasted")),
      )

      // F contains the transaction. Wait until tracking has found it before
      // announcing F+1 and F+2, which the tracker will also hold.
      const txBlock = await chain.newBlock({ transactions: [tx] })
      const included = await firstValueFrom(
        tracked.replay$.pipe(filter((event) => event.type === "inBestBlock")),
      )
      expect(included.block.hash).toBe(txBlock)
      expect(included.ok).toBe(true)

      const nextBlock = await chain.newBlock({
        parent: txBlock,
        transactions: [],
      })
      const batchTip = await chain.newBlock({
        parent: nextBlock,
        transactions: [],
      })
      await firstValueFrom(
        client.bestBlocks$.pipe(filter(([best]) => best.hash === batchTip)),
      )
      expect(finalized.next).toHaveBeenCalledTimes(1)
      expect(tracked.complete).not.toHaveBeenCalled()

      // Finalize [F, F+1, F+2] in one jump. Holding F synchronously lets the
      // transaction complete and release its holds before F+1 is delivered.
      await chain.changeFinalized(batchTip)
      await firstValueFrom(
        finalized.replay$.pipe(filter((block) => block.hash === batchTip)),
      )
      const result = await firstValueFrom(
        tracked.replay$.pipe(filter((event) => event.type === "finalized")),
      )
      await Promise.all(eventReads)

      expect(result.block.hash).toBe(txBlock)
      expect(tracked.complete).toHaveBeenCalledOnce()
      expect(finalized.next.mock.calls.map(([block]) => block.hash)).toEqual([
        initialFinalized.hash,
        txBlock,
        nextBlock,
        batchTip,
      ])
      expect(holdErrors).toEqual([])
      expect(finalized.error).not.toHaveBeenCalled()
      expect(tracked.error).not.toHaveBeenCalled()
    } finally {
      subscriptions.unsubscribe()
      client.destroy()
      chain.destroy()
    }
  })
})
