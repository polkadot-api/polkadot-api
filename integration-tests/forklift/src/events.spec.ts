import { MultiAddress, Paseo, paseo } from "@polkadot-api/descriptors"
import { Blake2256 } from "@polkadot-api/substrate-bindings"
import { Binary, createClient, TypedApi } from "polkadot-api"
import { filter, firstValueFrom, lastValueFrom, takeWhile, toArray } from "rxjs"
import { describe, expect, it, vi } from "vitest"
import { BOB, getForkliftProvider } from "./lib/forklift"
import { accumulate, observe } from "./lib/observe"
import { ALICE, getDevSigner } from "./lib/signer"
import { wait } from "./lib/utils"

const aliceSigner = getDevSigner("//Alice")
const bobSigner = getDevSigner("//Bob")

describe("events", () => {
  describe("watch()", () => {
    it(".watch() reports events after awaiting for the initial block", async () => {
      const [provider, chain] = getForkliftProvider("events_watch")
      const client = createClient(provider)
      const api = client.getTypedApi(paseo)

      await api.getStaticApis()

      const testFn = vi.fn()
      const completeFn = vi.fn()
      const errorFn = vi.fn()
      const subscription = api.event.System.ExtrinsicSuccess.watch().subscribe({
        next: testFn,
        error: errorFn,
        complete: completeFn,
      })

      await chain.newBlock()

      expect(errorFn).not.toHaveBeenCalled()
      expect(completeFn).not.toHaveBeenCalled()
      expect(testFn).toHaveBeenCalled()

      subscription.unsubscribe()
      client.destroy()
    })
  })

  describe("watchBest()", () => {
    it("notifies best blocks with their events", async () => {
      const [provider, chain] = getForkliftProvider(
        "events_watch-best_best-blocks",
      )
      const client = createClient(provider)
      const finalized = await client.getFinalizedBlock()
      const typedApi = client.getTypedApi(paseo)

      const remarked = observe(typedApi.event.System.Remarked.watchBest())

      // It should emit the events in the finalized block (as it's also the best)
      const finalizedNotifications = await lastValueFrom(
        remarked.next$.pipe(
          filter((v) => v.block.hash === finalized.hash),
          takeWhile((v) => v.type !== "finalized", true),
          toArray(),
        ),
      )
      expect(finalizedNotifications.length).toBe(2)
      expect(finalizedNotifications[0].type).toBe("new")
      expect(finalizedNotifications[0].events.length).toBe(0)
      expect(finalizedNotifications[1].type).toBe("finalized")
      expect(finalizedNotifications[1].events.length).toBe(0)

      // It should notify of new events coming through, filtered by type.
      const hello = await getRemark(typedApi, "hello")
      const transferTx = await typedApi.tx.Balances.transfer_keep_alive({
        dest: MultiAddress.Id(BOB),
        value: 100n,
      }).sign(bobSigner)

      // Make sure no other emissions leaked in before clearing
      expect(remarked.next).toHaveBeenCalledTimes(2)
      remarked.clearNext()

      const helloEvtPromise = firstValueFrom(remarked.next$)
      const helloBlock = await chain.newBlock({
        type: "best",
        transactions: [transferTx, hello.tx],
      })

      const helloEvt = await helloEvtPromise
      expect(helloEvt.type).toEqual("new")
      expect(helloEvt.block.hash).toEqual(helloBlock)
      expect(helloEvt.events.length).toEqual(1)
      expect(helloEvt.events[0].payload.hash).toEqual(hello.hash)

      expect(remarked.next).toHaveBeenCalledTimes(1)
      remarked.clearNext()

      // And then should notify when it finalizes
      const lastFinalized = await chain.newBlock({
        type: "finalized",
      })
      const afterFinalized = await firstValueFrom(
        remarked.replay$.pipe(
          takeWhile(
            (evt) =>
              evt.block.hash !== lastFinalized || evt.type !== "finalized",
            true,
          ),
          toArray(),
        ),
      )
      expect(afterFinalized.length).toEqual(3) // finalized, new, finalized
      // The order should be by block
      expect(afterFinalized[0].block.hash).toEqual(helloBlock)
      expect(afterFinalized[0].events[0].payload.hash).toEqual(hello.hash)

      remarked.unsubscribe()
      client.destroy()
    })

    it("reverts old best blocks with 'drop' emissions", async () => {
      const [provider, chain] = getForkliftProvider(
        "events_watch-best_best-blocks",
      )
      const client = createClient(provider)
      const finalized = await client.getFinalizedBlock()
      const typedApi = client.getTypedApi(paseo)
      const initialNonce = (await typedApi.query.System.Account.getValue(ALICE))
        .nonce

      // It should notify of new events coming through, filtered by type.
      const helloBest = await getRemark(typedApi, "hello best")
      const firstBest = await chain.newBlock({
        type: "best",
        transactions: [helloBest.tx],
      })

      // We should receive the best notification
      const remarked = observe(typedApi.event.System.Remarked.watchBest())
      await firstValueFrom(
        remarked.replay$.pipe(
          filter((v) => v.type === "new" && v.block.hash === firstBest),
        ),
      )
      remarked.clearNext()

      const helloCompeting = await getRemark(
        typedApi,
        "hello competing",
        initialNonce,
      )
      const baseCompeting = await chain.newBlock({
        parent: finalized.hash,
        type: "fork",
        transactions: [helloCompeting.tx],
      })

      // It should not emit anything, even after events for that block are loaded
      await typedApi.query.System.Events.getValue({ at: baseCompeting })
      // Wait an extra bit just in case
      await wait(100)
      expect(remarked.next).not.toHaveBeenCalled()

      const tipCompeting = await chain.newBlock({
        parent: baseCompeting,
        type: "best",
      })
      const emissions = await lastValueFrom(
        remarked.replay$.pipe(
          takeWhile((evt) => evt.block.hash !== tipCompeting, true),
          accumulate(),
        ),
      )

      // drop -> new (with event) -> new (no events)
      expect(emissions.length).toEqual(3)
      expect(emissions[0].type).toEqual("drop")
      expect(emissions[0].block.hash).toEqual(firstBest)
      expect(emissions[1].type).toEqual("new")
      expect(emissions[1].events[0].payload.hash).toEqual(helloCompeting.hash)
      expect(emissions[2].type).toEqual("new")

      remarked.unsubscribe()
      client.destroy()
    })
  })
})

const getRemark = async (
  typedApi: TypedApi<Paseo>,
  remark: string,
  nonce?: number,
) => {
  const data = Binary.fromText(remark)
  const tx = await typedApi.tx.System.remark_with_event({
    remark: data,
  }).sign(aliceSigner, {
    nonce,
  })
  return { tx, hash: Binary.toHex(Blake2256(data)) }
}
