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
    const {
      fixtures: { getNewMessages, SUBSCRIPTION_ID },
      ...chainHead
    } = setupChainHeadWithSubscription()

    getNewMessages()
    chainHead[name](...(args as [any]))

    expect(getNewMessages()).toMatchObject([
      {
        method: `chainHead_unstable_${name}`,
        params: [SUBSCRIPTION_ID, ...args],
      },
    ])
  })

  it("resolves the correct response", () => {
    const {
      fixtures: { sendMessage },
      ...chainHead
    } = setupChainHeadWithSubscription()

    const promise = chainHead[name](...(args as [any]))

    sendMessage({
      id: 3,
      result,
    })

    return expect(promise).resolves.toEqual(expectedResult)
  })

  it("rejects the JSON-RPC Error when the request fails", () => {
    const {
      fixtures: { sendMessage },
      ...chainHead
    } = setupChainHeadWithSubscription()

    const promise = chainHead[name](...(args as [any]))

    sendMessage({
      id: 3,
      error: parseError,
    })

    return expect(promise).rejects.toEqual(new RpcError(parseError))
  })

  it("rejects with an `DisjointError` when the function is created after `unfollow`", () => {
    const { unfollow, ...chainHead } = setupChainHead()

    unfollow()

    return expect(chainHead[name](...(args as [any]))).rejects.toEqual(
      new DisjointError(),
    )
  })

  it("rejects an `DisjointError` when the follow subscription fails", async () => {
    let { fixtures, ...chainHead } = setupChainHead()

    let promise = chainHead[name](...(args as [any]))
    // The errored JSON-RPC response comes **after** the user has called `header`/`unpin`
    fixtures.sendMessage({
      id: 2,
      error: parseError,
    })

    await expect(promise).rejects.toEqual(new DisjointError())
    ;({ fixtures, ...chainHead } = setupChainHead())

    // The errored JSON-RPC response comes **before** the user has called `header`/`unpin`
    fixtures.sendMessage({
      id: 2,
      error: parseError,
    })
    promise = chainHead[name](...(args as [any]))

    await expect(promise).rejects.toEqual(new DisjointError())
  })
})
