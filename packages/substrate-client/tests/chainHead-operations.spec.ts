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
    { name: "body" } as const,
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
    { name: "call" } as const,
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
    "storage - value",
    { name: "storage", discardedItems: 0 } as const,
    ["someHash", "value", "someStorageKey", null] as [
      hash: string,
      type: "value",
      key: string,
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
    "someStorageValue",
  ],
  [
    "storage - hash",
    { name: "storage", discardedItems: 0 } as const,
    ["someHash", "hash", "someStorageKey", null] as [
      hash: string,
      type: "hash",
      key: string,
      childTrie: string | null,
    ],
    ["someHash", [{ key: "someStorageKey", type: "hash" }], null],
    [
      {
        event: "operationStorageItems",
        items: [
          {
            key: "someStorageKey",
            hash: "someStorageHash",
          },
        ],
      },
      {
        event: "operationStorageDone",
      },
    ],
    "someStorageHash",
  ],
  [
    "storage - closestDescendantMerkleValue",
    { name: "storage", discardedItems: 0 } as const,
    ["someHash", "closestDescendantMerkleValue", "someStorageKey", null] as [
      hash: string,
      type: "closestDescendantMerkleValue",
      key: string,
      childTrie: string | null,
    ],
    [
      "someHash",
      [{ key: "someStorageKey", type: "closestDescendantMerkleValue" }],
      null,
    ],
    [
      {
        event: "operationStorageItems",
        items: [
          {
            key: "someStorageKey",
            closestDescendantMerkleValue: "someStorageDescendantMerkleValue",
          },
        ],
      },
      {
        event: "operationStorageDone",
      },
    ],
    "someStorageDescendantMerkleValue",
  ],
  [
    "storage - descendantsValues",
    { name: "storage", discardedItems: 0 } as const,
    ["someHash", "descendantsValues", "someStorageKey", null] as [
      hash: string,
      type: "descendantsValues",
      key: string,
      childTrie: string | null,
    ],
    ["someHash", [{ key: "someStorageKey", type: "descendantsValues" }], null],
    [
      {
        event: "operationStorageItems",
        items: [
          {
            key: "someStorageKey1",
            value: "value1",
          },
          {
            key: "someStorageKey2",
            value: "value2",
          },
        ],
      },
      {
        event: "operationStorageDone",
      },
    ],
    [
      {
        key: "someStorageKey1",
        value: "value1",
      },
      {
        key: "someStorageKey2",
        value: "value2",
      },
    ],
  ],
  [
    "storage - descendantsHashes",
    { name: "storage", discardedItems: 0 } as const,
    ["someHash", "descendantsHashes", "someStorageKey", null] as [
      hash: string,
      type: "descendantsHashes",
      key: string,
      childTrie: string | null,
    ],
    ["someHash", [{ key: "someStorageKey", type: "descendantsHashes" }], null],
    [
      {
        event: "operationStorageItems",
        items: [
          {
            key: "someStorageKey1",
            hash: "hash1",
          },
          {
            key: "someStorageKey2",
            hash: "hash2",
          },
        ],
      },
      {
        event: "operationStorageDone",
      },
    ],
    [
      {
        key: "someStorageKey1",
        hash: "hash1",
      },
      {
        key: "someStorageKey2",
        hash: "hash2",
      },
    ],
  ],
])(
  "chainhead: %s",
  (_, op, args, expectedMsgArgs, operationNotifications, expectedResult) => {
    it("sends the correct operation message", () => {
      const {
        fixtures: { getNewMessages, SUBSCRIPTION_ID },
      } = setupChainHeadOperation(op.name, ...args)

      expect(getNewMessages()).toMatchObject([
        {
          method: `chainHead_unstable_${op.name}`,
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
        op,
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
        op,
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

      const operationPromise = (chainhead[op.name] as any)(
        ...([...args, controller.signal] as any[]),
      )

      controller.abort()

      sendMessage({
        id: 2,
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
      } = setupChainHeadOperation(op.name, ...args)

      sendMessage({
        id: 3,
        result: { result: "limitReached" },
      })

      return expect(operationPromise).rejects.toEqual(new OperationLimitError())
    })

    it("rejects with an `OperationInaccessibleError` when receiving its event", () => {
      const {
        fixtures: { sendOperationNotification },
        operationPromise,
      } = setupChainHeadOperationSubscription(op, ...args)

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
      } = setupChainHeadOperationSubscription(op, ...args)

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

      return expect(
        (chainHead[op.name] as any)(...(args as any[])),
      ).rejects.toEqual(new DisjointError())
    })

    test("it rejects an `DisjointError` error when the follow subscription fails", async () => {
      let { fixtures, ...chainHead } = setupChainHead()

      const promise = (chainHead[op.name] as any)(...(args as any[]))

      fixtures.sendMessage({
        id: 2,
        error: parseError,
      })

      await expect(promise).rejects.toEqual(new DisjointError())
      ;({ fixtures, ...chainHead } = setupChainHead())

      fixtures.sendMessage({
        id: 2,
        error: parseError,
      })

      await expect(
        (chainHead[op.name] as any)(...(args as any[])),
      ).rejects.toEqual(new DisjointError())
    })
  },
)
