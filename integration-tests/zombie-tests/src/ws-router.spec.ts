import { apply, middleware } from "@polkadot-api/ws-middleware"
import { getWsProvider, Middleware } from "@polkadot-api/ws-provider"
import { createClient, JsonRpcProvider } from "polkadot-api"
import { SocketEvents } from "polkadot-api/ws"
import {
  bufferTime,
  filter,
  lastValueFrom,
  switchMap,
  take,
  takeWhile,
} from "rxjs"
import { describe, expect, it } from "vitest"
import { getInnerLogs } from "./inner-logs"
import { withLogs } from "./with-logs"

const { PROVIDER, VERSION } = process.env
const ZOMBIENET_URI = "ws://127.0.0.1:9934/"

if (
  PROVIDER === "ws" &&
  !["polkadot-v1.1.0", "polkadot-stable2407-5"].includes(VERSION!)
) {
  describe("ws-router", () => {
    it("routes chainHead_v1 through modern RPC and archive_v1 through legacy RPC", async () => {
      let calledMethods = new Set<string>()
      const innerLogger = getInnerLogs("WS-ROUTER")
      const provider = getWsProvider(ZOMBIENET_URI, {
        logger: (evt) => {
          innerLogger(evt)
          if (evt.type === SocketEvents.OUT) {
            const { method } = JSON.parse(evt.msg)
            calledMethods.add(method)
          }
        },
        middleware: apply(withDisabledArchive, middleware),
      })
      const client = createClient(outterLogs(provider))

      const initialBlock = await client.getFinalizedBlock()

      // Wait until it's unpinned
      await lastValueFrom(
        client.finalizedBlock$.pipe(
          switchMap(() =>
            client.blocks$.pipe(
              bufferTime(100),
              filter((v) => v.length > 0),
              take(1),
            ),
          ),
          takeWhile((v) => v.some((block) => block.hash === initialBlock.hash)),
        ),
      )

      expect(
        calledMethods.has("chainHead_v1_follow"),
        "chainHead_v1_follow not called",
      ).toBeTruthy()

      await expect(
        client
          .getUnsafeApi()
          .query.System.Account.getValue(
            "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
            {
              at: initialBlock.hash,
            },
          ),
      ).resolves.not.toThrow()

      expect(
        calledMethods.has("archive_v1_storage"),
        "archive_v1_storage was called: that's cheating!",
      ).toBeFalsy()

      client.destroy()
    })

    it("routes chainHead_v1 to legacy RPC if it fails with too many follow subscriptions", async () => {
      let calledMethods = new Set<string>()
      const innerLogger = getInnerLogs("WS-ROUTER")
      const provider = getWsProvider(ZOMBIENET_URI, {
        logger: (evt) => {
          innerLogger(evt)
          if (evt.type === SocketEvents.OUT) {
            const { method } = JSON.parse(evt.msg)
            calledMethods.add(method)
          }
        },
        middleware: apply(middleware, withSaturateFollow),
      })
      const client = createClient(outterLogs(provider))

      await client
        .getUnsafeApi()
        .query.System.Account.getValue(
          "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        )

      expect(
        calledMethods.has("chainHead_v1_storage"),
        "chainHead_v1_storage should not be called: Please update the test to saturate the amount of follow subscriptions",
      ).toBeFalsy()

      client.destroy()
    })
  })
} else {
  // Otherwise the CI fails b/c it can't find a test... ¯\_(ツ)_/¯
  describe("dummy", () => {
    it("works", () => {
      expect(true).toBe(true)
    })
  })
}

const withDisabledArchive: Middleware = (provider) => (onMsg, onHalt) => {
  let rpcMethodsId: any = null
  const baseConnection = provider((msg) => {
    if (msg.id === rpcMethodsId && "result" in msg) {
      rpcMethodsId = null
      onMsg({
        ...msg,
        result: {
          methods: msg.result.methods.filter(
            (v: string) => !v.startsWith("archive_v1"),
          ),
        },
      })
    } else {
      onMsg(msg)
    }
  }, onHalt)

  return {
    send(message) {
      if (message.method === "rpc_methods") {
        rpcMethodsId = message.id
      }
      baseConnection.send(message)
    },
    disconnect() {
      baseConnection.disconnect()
    },
  }
}

const withSaturateFollow: Middleware = (provider) => (onMsg, onHalt) => {
  const baseConnection = provider(onMsg, onHalt)

  for (let i = 0; i < 4; i++) {
    baseConnection.send({
      jsonrpc: "2.0",
      id: `saturating-follow-${i}`,
      method: "chainHead_v1_follow",
      params: [false],
    })
  }

  return baseConnection
}

let outterIdx = 0
const outterLogs = (provider: JsonRpcProvider) =>
  withLogs(`./${VERSION}_WS_ROUTER_OUT${outterIdx++}_JSON_RPC`, provider)
