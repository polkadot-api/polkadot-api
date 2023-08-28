import { expect, describe, test } from "vitest"
import {
  setupChainHead,
  setupChainHeadOperation,
  setupChainHeadOperationSubscription,
} from "./fixtures"
import {
  ErrorDisjoint,
  ErrorOperation,
  ErrorOperationInaccessible,
  ErrorOperationLimit,
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
    test("it sends the correct operation message", () => {
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

    test("it processes its operation notifications and resolves the correct value", () => {
      const {
        fixtures: { sendOperationNotification },
        operationPromise,
      } = setupChainHeadOperationSubscription(name, ...args)

      operationNotifications.forEach(sendOperationNotification)

      return expect(operationPromise).resolves.toEqual(expectedResult)
    })

    test("it cancels the ongoing operation", async () => {
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

    test("it rejects with an `ErrorOperationLimit` Error when necessary", () => {
      const {
        fixtures: { sendMessage },
        operationPromise,
      } = setupChainHeadOperation(name, ...args)

      sendMessage({
        id: 2,
        result: { result: "limitReached" },
      })

      return expect(operationPromise).rejects.toEqual(new ErrorOperationLimit())
    })

    test("ErrorOperationInaccessible", () => {
      const {
        fixtures: { sendOperationNotification },
        operationPromise,
      } = setupChainHeadOperationSubscription(name, ...args)

      sendOperationNotification({
        event: "operationInaccessible",
      })

      return expect(operationPromise).rejects.toEqual(
        new ErrorOperationInaccessible(),
      )
    })

    test("ErrorOperation", () => {
      const {
        fixtures: { sendOperationNotification },
        operationPromise,
      } = setupChainHeadOperationSubscription(name, ...args)

      const error = "something went wrong"
      sendOperationNotification({
        event: "operationError",
        error,
      })

      return expect(operationPromise).rejects.toEqual(new ErrorOperation(error))
    })

    test("it rejects an `ErrorDisjoint` error when the follow subscription fails", async () => {
      let { fixtures, ...chainehad } = setupChainHead()

      const promise = chainehad[name](...(args as any[]))

      fixtures.sendMessage({
        id: 1,
        error: {
          code: -32700,
          message: "Parse error",
        },
      })

      await expect(promise).rejects.toEqual(new ErrorDisjoint())
      ;({ fixtures, ...chainehad } = setupChainHead())

      fixtures.sendMessage({
        id: 1,
        error: {
          code: -32700,
          message: "Parse error",
        },
      })

      await expect(chainehad[name](...(args as any[]))).rejects.toEqual(
        new ErrorDisjoint(),
      )
    })
  },
)
