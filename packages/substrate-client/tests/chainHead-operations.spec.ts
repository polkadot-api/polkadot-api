import { expect, describe, test, it } from "vitest"
import {
  parseError,
  setupChainHead,
  setupChainHeadOperation,
  setupChainHeadOperationSubscription,
} from "./fixtures"
import {
  DisjointError,
  OperationError,
  OperationInaccessibleError,
  OperationLimitError,
} from "@/chainhead"

describe.each([
  [
    "body" as "body",
    ["someHash"] as [string],
    ["someHash"] as [string],
    [
      {
        event: "operationBodyDone",
        value: ["tx1", "tx2"],
      },
    ],
    ["tx1", "tx2"],
  ],
  [
    "call" as "call",
    ["someHash", "someFnName", "someCallParams"] as [string, string, string],
    ["someHash", "someFnName", "someCallParams"] as [string, string, string],
    [
      {
        event: "operationCallDone",
        output: "operationCallOutput",
      },
    ],
    "operationCallOutput",
  ],
  [
    "storage" as "storage",
    ["someHash", { value: ["someStorageKey"] }, null] as [
      hash: string,
      query: Partial<{
        value: Array<string>
        hash: Array<string>
        descendantsValues: Array<string>
        descendantsHashes: Array<string>
        closestDescendantMerkleValue: Array<string>
      }>,
      childTrie: string | null,
    ],
    ["someHash", [{ key: "someStorageKey", type: "value" }], null],
    [
      {
        event: "operationStorageItems",
        items: [
          {
            key: "someStorageKey",
            value: "someStorageValue",
          },
        ],
      },
      {
        event: "operationStorageDone",
      },
    ],
    {
      values: {
        someStorageKey: "someStorageValue",
      },
      closests: {},
      descendantsHashes: {},
      descendantsValues: {},
      hashes: {},
    },
  ],
])(
  "chainhead: %s",
  (name, args, expectedMsgArgs, operationNotifications, expectedResult) => {
    it("sends the correct operation message", () => {
      const {
        fixtures: { getNewMessages, SUBSCRIPTION_ID },
      } = setupChainHeadOperation(name, ...args)

      expect(getNewMessages()).toMatchObject([
        {
          method: `chainHead_unstable_${name}`,
          params: [SUBSCRIPTION_ID, ...expectedMsgArgs],
        },
      ])
    })

    it("processes its operation notifications and resolves the correct value", () => {
      const controller = new AbortController()
      const {
        fixtures: { sendOperationNotification },
        operationPromise,
      } = setupChainHeadOperationSubscription(
        name,
        ...[...args, controller.signal],
      )

      operationNotifications.forEach(sendOperationNotification)

      return expect(operationPromise).resolves.toEqual(expectedResult)
    })

    it("cancels the ongoing operation", async () => {
      const controller = new AbortController()
      const {
        operationPromise,
        fixtures: { getNewMessages, OPERATION_ID, SUBSCRIPTION_ID },
      } = setupChainHeadOperationSubscription(
        name,
        ...[...args, controller.signal],
      )

      controller.abort()

      expect(getNewMessages()).toMatchObject([
        {
          method: `chainHead_unstable_stopOperation`,
          params: [SUBSCRIPTION_ID, OPERATION_ID],
        },
      ])

      await expect(operationPromise).rejects.toMatchObject({
        name: "AbortError",
      })
    })

    it("cancels the ongoing operation before receiving its operationId", async () => {
      const controller = new AbortController()
      const {
        fixtures: { getNewMessages, sendMessage },
        ...chainhead
      } = setupChainHead()
      getNewMessages()

      const operationPromise = chainhead[name](
        ...([...args, controller.signal] as any[]),
      )

      controller.abort()

      sendMessage({
        id: 1,
        result: "someSubscription",
      })

      expect(getNewMessages()).toEqual([])

      await expect(operationPromise).rejects.toMatchObject({
        name: "AbortError",
      })
    })

    it("rejects with an `OperationLimitError` when receiving its event", () => {
      const {
        fixtures: { sendMessage },
        operationPromise,
      } = setupChainHeadOperation(name, ...args)

      sendMessage({
        id: 2,
        result: { result: "limitReached" },
      })

      return expect(operationPromise).rejects.toEqual(new OperationLimitError())
    })

    it("rejects with an `OperationInaccessibleError` when receiving its event", () => {
      const {
        fixtures: { sendOperationNotification },
        operationPromise,
      } = setupChainHeadOperationSubscription(name, ...args)

      sendOperationNotification({
        event: "operationInaccessible",
      })

      return expect(operationPromise).rejects.toEqual(
        new OperationInaccessibleError(),
      )
    })

    it("rejects with an `OperationError` when receiving its event", () => {
      const {
        fixtures: { sendOperationNotification },
        operationPromise,
      } = setupChainHeadOperationSubscription(name, ...args)

      const error = "something went wrong"
      sendOperationNotification({
        event: "operationError",
        error,
      })

      return expect(operationPromise).rejects.toEqual(new OperationError(error))
    })

    test("it rejects with an `DisjointError` when the operation is created after `unfollow`", () => {
      const { unfollow, ...chainHead } = setupChainHead()

      unfollow()

      return expect(chainHead[name](...(args as any[]))).rejects.toEqual(
        new DisjointError(),
      )
    })

    test("it rejects an `DisjointError` error when the follow subscription fails", async () => {
      let { fixtures, ...chainHead } = setupChainHead()

      const promise = chainHead[name](...(args as any[]))

      fixtures.sendMessage({
        id: 1,
        error: parseError,
      })

      await expect(promise).rejects.toEqual(new DisjointError())
      ;({ fixtures, ...chainHead } = setupChainHead())

      fixtures.sendMessage({
        id: 1,
        error: parseError,
      })

      await expect(chainHead[name](...(args as any[]))).rejects.toEqual(
        new DisjointError(),
      )
    })
  },
)
