import { expect, describe, test, it } from "vitest"
import {
  ChainHeadOperation,
  parseError,
  setupChainHead,
  setupChainHeadOperation,
  setupChainHeadOperationSubscription,
} from "./fixtures"
import {
  DisjointError,
  FollowResponse,
  OperationError,
  OperationInaccessibleError,
  OperationLimitError,
} from "@/chainhead"

type Args<T extends keyof FollowResponse> = Parameters<FollowResponse[T]>

describe.each([
  [
    "body",
    { name: "body" },
    ["someHash"] satisfies Args<"body">,
    ["someHash"],
    [
      {
        event: "operationBodyDone",
        value: ["tx1", "tx2"],
      },
    ],
    ["tx1", "tx2"],
  ],
  [
    "call",
    { name: "call" },
    ["someHash", "someFnName", "someCallParams"] satisfies Args<"call">,
    ["someHash", "someFnName", "someCallParams"],
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
    { name: "storage", discardedItems: 0 },
    ["someHash", "value", "someStorageKey", null] satisfies Args<"storage">,
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
    { name: "storage", discardedItems: 0 },
    ["someHash", "hash", "someStorageKey", null] satisfies Args<"storage">,
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
    { name: "storage", discardedItems: 0 },
    [
      "someHash",
      "closestDescendantMerkleValue",
      "someStorageKey",
      null,
    ] satisfies Args<"storage">,
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
    { name: "storage", discardedItems: 0 },
    [
      "someHash",
      "descendantsValues",
      "someStorageKey",
      null,
    ] satisfies Args<"storage">,
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
        event: "operationWaitingForContinue",
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
    { name: "storage", discardedItems: 0 },
    [
      "someHash",
      "descendantsHashes",
      "someStorageKey",
      null,
    ] satisfies Args<"storage">,
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
] satisfies Array<[string, ChainHeadOperation, any[], any[], any, any]>)(
  "chainhead: %s",
  (_, op, args, expectedMsgArgs, operationNotifications, expectedResult) => {
    it("sends the correct operation message", async () => {
      const { provider, SUBSCRIPTION_ID } = await setupChainHeadOperation(
        op.name,
        ...args,
      )

      expect(provider.getNewMessages()).toMatchObject([
        {
          method: `chainHead_v1_${op.name}`,
          params: [SUBSCRIPTION_ID, ...expectedMsgArgs],
        },
      ])
    })

    it("processes its operation notifications and resolves the correct value", async () => {
      const controller = new AbortController()
      const { sendOperationNotification, operationPromise } =
        await setupChainHeadOperationSubscription(
          op,
          ...[...args, controller.signal],
        )

      operationNotifications.forEach(sendOperationNotification)

      return expect(operationPromise).resolves.toEqual(expectedResult)
    })

    it("cancels the ongoing operation", async () => {
      const controller = new AbortController()
      const { operationPromise, provider, OPERATION_ID, SUBSCRIPTION_ID } =
        await setupChainHeadOperationSubscription(
          op,
          ...[...args, controller.signal],
        )

      controller.abort()

      expect(provider.getNewMessages()).toMatchObject([
        {
          method: `chainHead_v1_stopOperation`,
          params: [SUBSCRIPTION_ID, OPERATION_ID],
        },
      ])

      await expect(operationPromise).rejects.toMatchObject({
        name: "AbortError",
      })
    })

    it("cancels the ongoing operation before receiving its operationId", async () => {
      const controller = new AbortController()
      const { provider, chainHead } = await setupChainHead()
      provider.getNewMessages()

      const operationPromise = (chainHead[op.name] as any)(
        ...([...args, controller.signal] as any[]),
      )

      controller.abort()

      provider.replyLast({
        result: "someSubscription",
      })

      expect(provider.getNewMessages()).toEqual([])

      await expect(operationPromise).rejects.toMatchObject({
        name: "AbortError",
      })
    })

    it("rejects with an `OperationLimitError` when receiving its event", async () => {
      const { provider, operationPromise } = await setupChainHeadOperation(
        op.name,
        ...args,
      )

      provider.replyLast({
        result: { result: "limitReached" },
      })

      return expect(operationPromise).rejects.toEqual(new OperationLimitError())
    })

    it("rejects with an `OperationInaccessibleError` when receiving its event", async () => {
      const { sendOperationNotification, operationPromise } =
        await setupChainHeadOperationSubscription(op, ...args)

      sendOperationNotification({
        event: "operationInaccessible",
      })

      return expect(operationPromise).rejects.toEqual(
        new OperationInaccessibleError(),
      )
    })

    it("rejects with an `OperationError` when receiving its event", async () => {
      const { sendOperationNotification, operationPromise } =
        await setupChainHeadOperationSubscription(op, ...args)

      const error = "something went wrong"
      sendOperationNotification({
        event: "operationError",
        error,
      })

      return expect(operationPromise).rejects.toEqual(new OperationError(error))
    })

    test("it rejects with an `DisjointError` when the operation is created after `unfollow`", async () => {
      const { chainHead } = await setupChainHead()

      chainHead.unfollow()

      return expect(
        (chainHead[op.name] as any)(...(args as any[])),
      ).rejects.toEqual(new DisjointError())
    })

    it("rejects an `DisjointError` error when the follow subscription fails and the operation is pending", async () => {
      const { provider, chainHead } = await setupChainHead()

      const promise = (chainHead[op.name] as any)(...(args as any[]))

      provider.replyLast({
        error: parseError,
      })

      await expect(promise).rejects.toEqual(new DisjointError())
    })

    it("rejects an `DisjointError` error when the follow subscription fails for any subsequent operation", async () => {
      const { provider, chainHead } = await setupChainHead()

      provider.replyLast({
        error: parseError,
      })

      await expect(
        (chainHead[op.name] as any)(...(args as any[])),
      ).rejects.toEqual(new DisjointError())
    })
  },
)
