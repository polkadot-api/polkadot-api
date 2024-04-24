import { expect, describe, it } from "vitest"
import {
  parseError,
  setupChainHead,
  setupChainHeadWithSubscription,
} from "./fixtures"
import { DisjointError, FollowResponse } from "@/chainhead"
import { RpcError } from "@/client"

describe.each([
  ["unpin", [["someHash", "someOtherHash"]], null, undefined],
  ["header", ["someHash"], "someHeader", "someHeader"],
] satisfies Array<[keyof FollowResponse, any[], any, any]>)(
  "chainhead: %s",
  (name, args, result, expectedResult) => {
    it("sends the correct message", async () => {
      const { provider, SUBSCRIPTION_ID, chainHead } =
        await setupChainHeadWithSubscription()

      provider.getNewMessages()
      chainHead[name](...(args as [any]))

      expect(provider.getNewMessages()).toMatchObject([
        {
          method: `chainHead_v1_${name}`,
          params: [SUBSCRIPTION_ID, ...args],
        },
      ])
    })

    it("resolves the correct response", async () => {
      const { provider, chainHead } = await setupChainHeadWithSubscription()

      const promise = chainHead[name](...(args as [any]))
      provider.replyLast({ result })

      return expect(promise).resolves.toEqual(expectedResult)
    })

    it("rejects the JSON-RPC Error when the request fails", async () => {
      const { provider, chainHead } = await setupChainHeadWithSubscription()

      const promise = chainHead[name](...(args as [any]))
      provider.replyLast({ error: parseError })

      return expect(promise).rejects.toEqual(new RpcError(parseError))
    })

    it("rejects with an `DisjointError` when the function is created after `unfollow`", async () => {
      const { chainHead } = await setupChainHead()

      chainHead.unfollow()

      return expect(chainHead[name](...(args as [any]))).rejects.toEqual(
        new DisjointError(),
      )
    })

    it("rejects an `DisjointError` when the follow subscription fails and the operation is pending", async () => {
      const { provider, chainHead } = await setupChainHead()

      const promise = chainHead[name](...(args as [any]))
      // The errored JSON-RPC response comes **after** the user has called `header`/`unpin`
      provider.replyLast({
        error: parseError,
      })

      await expect(promise).rejects.toEqual(new DisjointError())
    })

    it("rejects an `DisjointError` when the follow subscription fails for any subsequent operation", async () => {
      const { provider, chainHead } = await setupChainHead()

      // The errored JSON-RPC response comes **before** the user has called `header`/`unpin`
      provider.replyLast({
        error: parseError,
      })
      const promise = chainHead[name](...(args as [any]))

      await expect(promise).rejects.toEqual(new DisjointError())
    })
  },
)
