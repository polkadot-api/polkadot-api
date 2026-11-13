import { dotAh, MultiAddress } from "@polkadot-api/descriptors"
import { AccountId, Binary, createClient, Enum, TxEvent } from "polkadot-api"
import { filter, firstValueFrom, shareReplay } from "rxjs"
import { describe, expect, it } from "vitest"
import { getForkliftProvider } from "./lib/forklift"
import { observe } from "./lib/observe"
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
    expect(latestEvent.type === "inBestBlock").toBe(true)

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
    expect(latestEvent.type === "notInBestBlock").toBe(true)

    sub.unsubscribe()
  })

  // https://github.com/polkadot-api/polkadot-api/issues/1466
  it("keeps tracking a transaction past a block where it is invalid", async () => {
    const [provider, chain] = getForkliftProvider("tx_invalid_ancestor", {
      finalizeMode: Enum("manual"),
      buildBlockMode: Enum("manual"),
    })

    const client = createClient(provider)
    const api = client.getTypedApi(dotAh)
    const hex = (txs: Uint8Array[]) => txs.map((tx) => Binary.toHex(tx))

    // An account without funds: it can't pay fees until `fundingTx` is applied.
    const unfundedPath = "//Issue1466"
    const unfundedSigner = getDevSigner(unfundedPath)

    const fundingTx = await api.tx.Balances.transfer_keep_alive({
      dest: MultiAddress.Id(AccountId().dec(unfundedSigner.publicKey)),
      value: 10_0_000_000_000n,
    }).create(aliceSigner)
    const remarkTx = await api.tx.System.remark({
      remark: Binary.fromText("issue 1466"),
    }).create(unfundedSigner)

    const funding = observe(client.submitAndWatch(fundingTx))
    let tracked: ReturnType<typeof observe<TxEvent>> | undefined

    try {
      const initial = await client.getFinalizedBlock()

      // The funding transaction goes into the pool
      await firstValueFrom(
        funding.replay$.pipe(filter((evt) => evt.type === "broadcasted")),
      )

      // Block 2 only has the funding transaction. It has to exist before
      // submitting `remarkTx`: otherwise it's invalid everywhere and it's
      // rejected before being broadcasted.
      const block2 = await chain.newBlock({
        parent: initial.hash,
        transactions: [fundingTx],
      })
      await firstValueFrom(
        client.blocks$.pipe(filter((b) => b.hash === block2)),
      )

      // `remarkTx` is valid against block 2, so it gets broadcasted.
      tracked = observe(client.submitAndWatch(remarkTx))
      await firstValueFrom(
        tracked.replay$.pipe(filter((evt) => evt.type === "broadcasted")),
      )

      // Block 1 is an empty sibling of block 2 that shows up once `remarkTx` is
      // being tracked. `remarkTx` is invalid against it (Payment), and the
      // funding transaction stays in the pool for this branch.
      const block1 = await chain.newBlock({
        parent: initial.hash,
        transactions: [],
      })

      // Block 3 goes on top of block 1, and takes its transactions from the
      // pool: `remarkTx` becomes valid on this branch too.
      const block3 = await chain.newBlock({ parent: block1 })
      const block3Body = hex(await client.getBlockBody(block3))
      expect(block3Body).toContain(Binary.toHex(fundingTx))

      // Finalizing block 1, where `remarkTx` is invalid, must not fail the
      // submission: the transaction is valid on its descendants.
      await chain.changeFinalized(block1)
      await firstValueFrom(
        client.finalizedBlock$.pipe(filter((b) => b.hash === block1)),
      )
      await getMacroTask()
      expect(tracked.error).not.toHaveBeenCalled()

      await chain.changeFinalized(block3)

      const fundingResult = await firstValueFrom(
        funding.replay$.pipe(filter((evt) => evt.type === "finalized")),
      )
      expect(fundingResult.block.hash).toBe(block3)
      expect(fundingResult.ok).toBe(true)

      // If forklift's pool didn't include `remarkTx` in block 3, this won't
      // complete.
      expect(block3Body).toContain(Binary.toHex(remarkTx))
      const result = await firstValueFrom(
        tracked.replay$.pipe(filter((evt) => evt.type === "finalized")),
      )
      expect(result.block.hash).toBe(block3)
      expect(result.ok).toBe(true)
      expect(tracked.error).not.toHaveBeenCalled()
    } finally {
      funding.unsubscribe()
      tracked?.unsubscribe()
      client.destroy()
      chain.destroy()
    }
  })
})
