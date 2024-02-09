import { expect, describe, it } from "vitest"
import {
  parseError,
  setupChainHead,
  setupChainHeadWithSubscription,
} from "./fixtures"
import { DisjointError } from "@/chainhead"
import { RpcError } from "@/client"

describe.each([
  [
    "unpin" as "unpin",
    [["someHash", "someOtherHash"]] as [string[]],
    null,
    undefined,
  ],
  ["header" as "header", ["someHash"] as [string], "someHeader", "someHeader"],
])("chainhead: %s", (name, args, result, expectedResult) => {
  it("sends the correct message", () => {
    const { provider, SUBSCRIPTION_ID, chainHead } =
      setupChainHeadWithSubscription()

    provider.getNewMessages()
    chainHead[name](...(args as [any]))

    expect(provider.getNewMessages()).toMatchObject([
      {
        method: `chainHead_unstable_${name}`,
        params: [SUBSCRIPTION_ID, ...args],
      },
    ])
  })

  it("resolves the correct response", () => {
    const { provider, chainHead } = setupChainHeadWithSubscription()

    const promise = chainHead[name](...(args as [any]))

    provider.sendMessage({
      id: 3,
      result,
    })

    return expect(promise).resolves.toEqual(expectedResult)
  })

  it("rejects the JSON-RPC Error when the request fails", () => {
    const { provider, chainHead } = setupChainHeadWithSubscription()

    const promise = chainHead[name](...(args as [any]))

    provider.sendMessage({
      id: 3,
      error: parseError,
    })

    return expect(promise).rejects.toEqual(new RpcError(parseError))
  })

  it("rejects with an `DisjointError` when the function is created after `unfollow`", () => {
    const { chainHead } = setupChainHead()

    chainHead.unfollow()

    return expect(chainHead[name](...(args as [any]))).rejects.toEqual(
      new DisjointError(),
    )
  })

  it("rejects an `DisjointError` when the follow subscription fails and the operation is pending", async () => {
    const { provider, chainHead } = setupChainHead()

    const promise = chainHead[name](...(args as [any]))
    // The errored JSON-RPC response comes **after** the user has called `header`/`unpin`
    provider.sendMessage({
      id: 2,
      error: parseError,
    })

    await expect(promise).rejects.toEqual(new DisjointError())
  })

  it("rejects an `DisjointError` when the follow subscription fails for any subsequent operation", async () => {
    const { provider, chainHead } = setupChainHead()

    // The errored JSON-RPC response comes **before** the user has called `header`/`unpin`
    provider.sendMessage({
      id: 2,
      error: parseError,
    })
    const promise = chainHead[name](...(args as [any]))

    await expect(promise).rejects.toEqual(new DisjointError())
  })
})
