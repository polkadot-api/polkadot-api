import { expect, describe, test } from "vitest"
import { setupChainHead, setupChainHeadWithSubscription } from "./fixtures"
import { ErrorDisjoint } from "@/chainhead"
import { ErrorRpc, RpcError } from "@/client"

describe.each([
  [
    "unpin" as "unpin",
    [["someHash", "someOtherHash"]] as [string[]],
    null,
    undefined,
  ],
  ["header" as "header", ["someHash"] as [string], "someHeader", "someHeader"],
])("chainhead: %s", (name, args, result, expectedResult) => {
  test("it sends the correct message", () => {
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

  test("it resolves the correct response", () => {
    const {
      fixtures: { sendMessage },
      ...chainHead
    } = setupChainHeadWithSubscription()

    const promise = chainHead[name](...(args as [any]))

    sendMessage({
      id: 2,
      result,
    })

    return expect(promise).resolves.toEqual(expectedResult)
  })

  test("it rejects the JSON-RPC Error when the request fails", () => {
    const {
      fixtures: { sendMessage },
      ...chainHead
    } = setupChainHeadWithSubscription()

    const promise = chainHead[name](...(args as [any]))

    const error: RpcError = {
      code: -32700,
      message: "Parse error",
    }
    sendMessage({
      id: 2,
      error,
    })

    return expect(promise).rejects.toEqual(new ErrorRpc(error))
  })

  test("it rejects with an `ErrorDisjoint` Error when the function is created after `unfollow`", () => {
    const { unfollow, ...chainHead } = setupChainHead()

    unfollow()

    return expect(chainHead[name](...(args as [any]))).rejects.toEqual(
      new ErrorDisjoint(),
    )
  })

  test("it rejects an `ErrorDisjoint` Error when the follow subscription fails", async () => {
    let { fixtures, ...chainHead } = setupChainHead()

    const promise = chainHead[name](...(args as [any]))

    fixtures.sendMessage({
      id: 1,
      error: {
        code: -32700,
        message: "Parse error",
      },
    })

    await expect(promise).rejects.toEqual(new ErrorDisjoint())
    ;({ fixtures, ...chainHead } = setupChainHead())

    fixtures.sendMessage({
      id: 1,
      error: {
        code: -32700,
        message: "Parse error",
      },
    })

    await expect(chainHead[name](...(args as [any]))).rejects.toEqual(
      new ErrorDisjoint(),
    )
  })
})
