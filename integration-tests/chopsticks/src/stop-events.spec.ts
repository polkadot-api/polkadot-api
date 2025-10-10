import { paseo } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import {
  combineLatest,
  concatMap,
  filter,
  firstValueFrom,
  shareReplay,
  skip,
} from "rxjs"
import { describe, expect, it, vitest } from "vitest"
import "./chopsticks"
import { ALICE, BOB, createBlock, getChopsticksProvider } from "./chopsticks"
import { newBlock } from "./chopsticksUtils"
import {
  combineInterceptors,
  createStopInterceptor,
  Interceptor,
  InterceptorContext,
  providerInterceptor,
} from "./providerInterceptor"
import { wait } from "./utils"
import {
  isRequest,
  isResponse,
  JsonRpcId,
} from "@polkadot-api/json-rpc-provider"

describe("Stop events", () => {
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
        receiving(ctx, msg) {
          if (
            isRequest(msg) &&
            msg.method === "chainHead_v1_followEvent" &&
            msg.params.result.event === "finalized"
          ) {
            return
          }
          ctx.receive(msg)
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

  it("recovers after a stop event when there are operations in the operationLimit queue", async () => {
    const createStopAndThrottleInterceptor = (ctx: InterceptorContext) => {
      const [stopInterceptor, stopController] = createStopInterceptor(ctx)

      const ongoingOperations = new Set<JsonRpcId>()
      const operationIdToOperation = new Map<string, JsonRpcId>()
      let throttle = false
      const interceptor: Interceptor = {
        sending(ctx, msg) {
          if (msg.method !== "chainHead_v1_storage") {
            ctx.send(msg)
            return
          }
          if (throttle && ongoingOperations.size >= 1) {
            setTimeout(() => {
              ctx.receive(
                JSON.parse(
                  `{"jsonrpc":"2.0","id":"${msg.id}","result":{"result":"limitReached"}}`,
                ),
              )
            })
            return
          }
          ctx.send(msg)
          ongoingOperations.add(msg.id!)
        },
        receiving(ctx, msg) {
          if (
            isResponse(msg) &&
            "result" in msg &&
            ongoingOperations.has(msg.id)
          ) {
            if (msg.result.result !== "started") {
              console.log(msg)
              throw new Error("Operation not started")
            }
            operationIdToOperation.set(msg.result.operationId, msg.id)
            ctx.receive(msg)
            return
          }

          if (
            "method" in msg &&
            msg.method === "chainHead_v1_followEvent" &&
            operationIdToOperation.has(msg.params.result.operationId)
          ) {
            const op = operationIdToOperation.get(
              msg.params.result.operationId,
            )!
            const sendIt = () => {
              if (msg.params.result.event === "operationStorageDone") {
                ongoingOperations.delete(op)
              }
              ctx.receive(msg)
            }
            if (throttle) {
              setTimeout(sendIt, 500)
            } else {
              sendIt()
            }
            return
          }
          ctx.receive(msg)
        },
      }

      return [
        combineInterceptors(stopInterceptor, interceptor),
        {
          stop: async () => {
            stopController.sendUnfollow()
            ctx.send(
              JSON.parse(
                `{"jsonrpc":"2.0","id":"dev-nb","method":"dev_newBlock","params":[]}`,
              ),
            )
            stopController.sendStop()
          },
          throttle: () => (throttle = true),
        },
      ] as const
    }

    const [provider, getInterceptor] = providerInterceptor(
      getChopsticksProvider(),
      createStopAndThrottleInterceptor,
    )
    const client = createClient(provider)
    const api = client.getTypedApi(paseo)

    // Set up 2 storage subscriptions
    const alice$ = api.query.System.Account.watchValue(ALICE).pipe(
      shareReplay(1),
    )
    const bob$ = api.query.System.Account.watchValue(BOB).pipe(shareReplay(1))
    const aliceSub = alice$.subscribe()
    const bobSub = bob$.subscribe()

    await firstValueFrom(combineLatest([alice$, bob$]))

    getInterceptor().throttle()

    const nextFinalized = firstValueFrom(client.finalizedBlock$.pipe(skip(1)))
    await createBlock(client)
    await nextFinalized

    // Wait for the operation setup: the first will start going through, the second will get reported as "operationLimit"
    await wait(100)

    await getInterceptor().stop()

    await new Promise((resolve) => setTimeout(resolve, 3000))

    aliceSub.unsubscribe()
    bobSub.unsubscribe()
    client.destroy()
  })
})

const createStopAndHODLInterceptor = (ctx: InterceptorContext) => {
  const [stopInterceptor, stopController] = createStopInterceptor(ctx)
  const heldMessages: string[] = []
  let holdMessages = false

  const interceptor: Interceptor = {
    sending(ctx, msg) {
      if (holdMessages) {
        heldMessages.push(JSON.stringify(msg))
        return
      }
      ctx.send(msg)
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
        JSON.parse(
          `{"jsonrpc":"2.0","id":"${msg.id}","error":{ "code": -32800, "message": "Too many connections" }}`,
        ),
      )
    },
    resume: () => {
      holdMessages = false
      heldMessages.forEach((m) => ctx.send(JSON.parse(m)))
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
