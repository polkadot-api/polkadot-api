import { paseo } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { filter, firstValueFrom } from "rxjs"
import { beforeAll, describe, expect, it } from "vitest"
import "./chopsticks"
import { ALICE, getChopsticksProvider, newBlock } from "./chopsticks"
import {
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
    const createFailedStopInterceptor = (ctx: InterceptorContext) => {
      let subscription = ""
      let followingId = ""

      let failFollow = false

      const interceptor: Interceptor = {
        sending(msgStr) {
          const msg = JSON.parse(msgStr)
          if (msg.method === "chainHead_v1_follow") {
            if (failFollow) {
              failFollow = false
              setTimeout(() =>
                ctx.receive(
                  `{"jsonrpc":"2.0","id":"${msg.id}","error":{ "code": -32800, "message": "Too many connections" }}`,
                ),
              )
              return
            }
            followingId = msg.id
          }
          ctx.send(msgStr)
        },
        receiving(msgStr) {
          const msg = JSON.parse(msgStr)
          if (msg.id === followingId) {
            subscription = msg.result
          }
          ctx.receive(msgStr)
        },
      }

      const controller = {
        stopAndFailOnce: () => {
          failFollow = true
          ctx.send(
            `{"jsonrpc":"2.0","id":"unfollow-${subscription}","method":"chainHead_v1_unfollow","params":["${subscription}"]}`,
          )
          ctx.receive(
            `{"jsonrpc":"2.0","method":"chainHead_v1_followEvent","params":{"subscription":"${subscription}","result":{"event":"stop"}}}`,
          )
        },
      }

      return [interceptor, controller] as const
    }

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
    const createStopAndHODLInterceptor = (ctx: InterceptorContext) => {
      let subscription = ""
      let followingId = ""
      const heldMessages: string[] = []
      let holdMessages = false

      const interceptor: Interceptor = {
        sending(msgStr) {
          const msg = JSON.parse(msgStr)
          if (holdMessages) {
            heldMessages.push(msgStr)
            return
          }
          if (msg.method === "chainHead_v1_follow") {
            followingId = msg.id
          }
          ctx.send(msgStr)
        },
        receiving(msgStr) {
          const msg = JSON.parse(msgStr)
          if (msg.id === followingId) {
            subscription = msg.result
          }
          ctx.receive(msgStr)
        },
      }

      const controller = {
        stopAndHODL: () => {
          holdMessages = true
          ctx.send(
            `{"jsonrpc":"2.0","id":"unfollow-${subscription}","method":"chainHead_v1_unfollow","params":["${subscription}"]}`,
          )
          ctx.receive(
            `{"jsonrpc":"2.0","method":"chainHead_v1_followEvent","params":{"subscription":"${subscription}","result":{"event":"stop"}}}`,
          )
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

      return [interceptor, controller] as const
    }

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

    const account = await accountPromise
    expect(account.nonce).toBeGreaterThan(1000)
  })
})
