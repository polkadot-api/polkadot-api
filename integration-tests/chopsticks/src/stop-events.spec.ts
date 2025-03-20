import { paseo } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { concatMap, filter, firstValueFrom, shareReplay } from "rxjs"
import { beforeAll, describe, expect, it, vitest } from "vitest"
import "./chopsticks"
import { ALICE, getChopsticksProvider, newBlock } from "./chopsticks"
import {
  combineInterceptors,
  createStopInterceptor,
  Interceptor,
  InterceptorContext,
  providerInterceptor,
} from "./providerInterceptor"
import { wait } from "./utils"

describe("Stop events", () => {
  beforeAll(async () => {
    // Create a new block to pre-initialize chopsticks and prevent tests from timing out.
    await newBlock()
  })

  it("reconnects after a stop event recovery fails", async () => {
    const [provider, getInterceptor] = providerInterceptor(
      getChopsticksProvider(),
      createFailedStopInterceptor,
    )
    const client = createClient(provider)

    await firstValueFrom(client.bestBlocks$)

    getInterceptor().stopAndFailOnce()

    const blockHash = await newBlock()

    const [bestBlock] = await Promise.race([
      firstValueFrom(
        client.bestBlocks$.pipe(filter(([v]) => v.hash === blockHash)),
      ),
      wait(1000).then(() => [null]),
    ])
    expect(bestBlock).not.toBe(null)
    expect(bestBlock!.hash).toEqual(blockHash)
  })

  it("waits for stop event to resolve before starting a new operation", async () => {
    const [provider, getInterceptor] = providerInterceptor(
      getChopsticksProvider(),
      createStopAndHODLInterceptor,
    )
    const client = createClient(provider)

    await firstValueFrom(client.bestBlocks$)

    getInterceptor().stopAndHODL()

    const accountPromise = client
      .getTypedApi(paseo)
      .query.System.Account.getValue(ALICE)

    getInterceptor().failFollow()

    getInterceptor().resume()

    await wait(300)
    await newBlock()

    const account = await accountPromise
    expect(account.nonce).toBeGreaterThan(1000)
  })

  it("doesn't report unpined finalized blocks after stop recovery", async () => {
    const createStopAndIgnoreFinalizedInterceptor = (
      ctx: InterceptorContext,
    ) => {
      const [stopInterceptor, stopController] = createStopInterceptor(ctx)

      const interceptor: Interceptor = {
        receiving(ctx, msgStr) {
          const msg = JSON.parse(msgStr)
          if (
            msg.method === "chainHead_v1_followEvent" &&
            msg.params.result.event === "finalized"
          ) {
            return
          }
          ctx.receive(msgStr)
        },
      }

      return [
        combineInterceptors(stopInterceptor, interceptor),
        stopController,
      ] as const
    }

    const [provider, getInterceptor] = providerInterceptor(
      getChopsticksProvider(),
      createStopAndIgnoreFinalizedInterceptor,
    )
    const client = createClient(provider)
    const api = client.getTypedApi(paseo)

    const obs$ = client.finalizedBlock$.pipe(
      concatMap(async (block) => {
        const result = await api.query.System.Account.getValue(ALICE, {
          at: block.hash,
        })
        return { hash: block.hash, result }
      }),
      shareReplay(1),
    )
    const errorFn = vitest.fn()
    obs$.subscribe({
      error: errorFn,
    })
    await firstValueFrom(obs$)

    const hash = await newBlock(2)
    console.log(hash)
    await wait(300)

    getInterceptor().stop()

    await newBlock()

    await firstValueFrom(obs$.pipe(filter((r) => r.hash === hash)))
    expect(errorFn).not.toHaveBeenCalled()
  })
})

const createStopAndHODLInterceptor = (ctx: InterceptorContext) => {
  const [stopInterceptor, stopController] = createStopInterceptor(ctx)
  const heldMessages: string[] = []
  let holdMessages = false

  const interceptor: Interceptor = {
    sending(ctx, msgStr) {
      if (holdMessages) {
        heldMessages.push(msgStr)
        return
      }
      ctx.send(msgStr)
    },
  }

  const controller = {
    stopAndHODL: () => {
      holdMessages = true
      stopController.stop()
    },
    failFollow() {
      expect(heldMessages.length).toBe(1)
      expect(heldMessages[0].includes("chainHead_v1_follow")).toBe(true)
      const msg = JSON.parse(heldMessages[0])
      heldMessages.length = 0
      ctx.receive(
        `{"jsonrpc":"2.0","id":"${msg.id}","error":{ "code": -32800, "message": "Too many connections" }}`,
      )
    },
    resume: () => {
      holdMessages = false
      heldMessages.forEach(ctx.send)
      heldMessages.length = 0
    },
  }

  return [
    combineInterceptors(stopInterceptor, interceptor),
    controller,
  ] as const
}

const createFailedStopInterceptor = (ctx: InterceptorContext) => {
  const [hodlInterceptor, hodlController] = createStopAndHODLInterceptor(ctx)

  const controller = {
    stopAndFailOnce: async () => {
      hodlController.stopAndHODL()
      await wait(300)
      hodlController.failFollow()
      hodlController.resume()
    },
  }

  return [hodlInterceptor, controller] as const
}
