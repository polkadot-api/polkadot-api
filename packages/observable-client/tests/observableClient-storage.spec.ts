import { getObservableClient } from "@/index"
import {
  OperationLimitError,
  StorageItemInput,
} from "@polkadot-api/substrate-client"
import { describe, expect, it } from "vitest"
import { initializeWithMetadata, wait } from "./fixtures"
import { createMockSubstrateClient } from "./mockSubstrateClient"
import { observe } from "./observe"
import { map } from "rxjs"

describe("observableClient chainHead", () => {
  describe("storage$", () => {
    it("receives the storage value", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initializeWithMetadata(mockClient)

      const key = "foo"
      const observer = observe(
        chainHead.storage$(initialHash, "value", () => key),
      )

      expect(mockClient.chainHead.mock.storage).toHaveBeenCalledWith(
        initialHash,
        "value",
        key,
        null,
        expect.objectContaining({}),
      )
      const result = "value"
      await mockClient.chainHead.mock.storage.reply(initialHash, result)

      expect(observer.next).toHaveBeenCalledWith(result)
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })

    it("caches ongoing requests", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initializeWithMetadata(mockClient)

      const key = "foo"
      const observer = observe(
        chainHead.storage$(initialHash, "value", () => key),
      )

      expect(mockClient.chainHead.mock.storage).toHaveBeenCalledOnce()
      expect(mockClient.chainHead.mock.storage).toHaveBeenCalledWith(
        initialHash,
        "value",
        key,
        null,
        expect.objectContaining({}),
      )

      const observer2 = observe(
        chainHead.storage$(initialHash, "value", () => key),
      )
      expect(mockClient.chainHead.mock.storage).toHaveBeenCalledOnce()

      const result = "value"
      await mockClient.chainHead.mock.storage.reply(initialHash, result)

      expect(observer.next).toHaveBeenCalledWith(result)
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()

      expect(observer2.next).toHaveBeenCalledWith(result)
      expect(observer2.error).not.toHaveBeenCalled()
      expect(observer2.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })

    it("caches completed requests", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initializeWithMetadata(mockClient)

      const key = "foo"
      const observer = observe(
        chainHead.storage$(initialHash, "value", () => key),
      )

      expect(mockClient.chainHead.mock.storage).toHaveBeenCalledOnce()
      expect(mockClient.chainHead.mock.storage).toHaveBeenCalledWith(
        initialHash,
        "value",
        key,
        null,
        expect.objectContaining({}),
      )

      const observer2 = observe(
        chainHead.storage$(initialHash, "value", () => key),
      )

      const result = "value"
      await mockClient.chainHead.mock.storage.reply(initialHash, result)

      expect(mockClient.chainHead.mock.storage).toHaveBeenCalledOnce()

      expect(observer.next).toHaveBeenCalledWith(result)
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()

      expect(observer2.next).toHaveBeenCalledWith(result)
      expect(observer2.error).not.toHaveBeenCalled()
      expect(observer2.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })

    it("provides the runtime context on to the mapper functions", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash, metadata } = await initializeWithMetadata(mockClient)

      const key = "foo"
      const observer = observe(
        chainHead
          .storage$(
            initialHash,
            "value",
            (ctx) => {
              expect(ctx.lookup.metadata).toEqual(metadata)
              return key
            },
            null,
            (data, ctx) => {
              expect(ctx.lookup.metadata).toEqual(metadata)
              return data?.length ?? 0
            },
          )
          .pipe(map((x) => x.mapped)),
      )

      const result = "value"
      await mockClient.chainHead.mock.storage.reply(initialHash, result)

      expect(observer.next).toHaveBeenCalledWith(result.length)
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })
  })

  describe("storageQueries$", () => {
    it("receives multiple queries resolved at once", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initializeWithMetadata(mockClient)

      const queries: StorageItemInput[] = [
        {
          key: "foo",
          type: "value",
        },
        {
          key: "bar",
          type: "value",
        },
      ]
      const observer = observe(chainHead.storageQueries$(initialHash, queries))

      expect(
        mockClient.chainHead.mock.storageSubscription,
      ).toHaveBeenCalledWith(
        initialHash,
        queries,
        null,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )

      const responses = queries.map(({ key }) => ({
        key,
        value: `${key} response`,
      }))
      mockClient.chainHead.mock.storageSubscription
        .getLastCall(initialHash)
        .sendDiscarded(0)
        .sendItems(responses)
        .sendComplete()

      expect(observer.next).toHaveBeenCalledTimes(responses.length)
      responses.forEach((response) =>
        expect(observer.next).toHaveBeenCalledWith(response),
      )
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })

    it("makes discarded items transparent", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initializeWithMetadata(mockClient)

      const queries: StorageItemInput[] = [
        {
          key: "foo",
          type: "value",
        },
        {
          key: "bar",
          type: "value",
        },
        {
          key: "baz",
          type: "value",
        },
      ]
      const observer = observe(chainHead.storageQueries$(initialHash, queries))

      const responses = queries.map(({ key }) => ({
        key,
        value: `${key} response`,
      }))
      const initialResponses = responses.slice(0, -1)
      mockClient.chainHead.mock.storageSubscription
        .getLastCall(initialHash)
        .sendDiscarded(responses.length - initialResponses.length)
        .sendItems(initialResponses)
        .sendComplete()

      expect(observer.next).toHaveBeenCalledTimes(initialResponses.length)
      initialResponses.forEach((response) =>
        expect(observer.next).toHaveBeenCalledWith(response),
      )
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).not.toHaveBeenCalled()

      expect(
        mockClient.chainHead.mock.storageSubscription,
      ).toHaveBeenCalledTimes(2)

      // Check it only sent the second batch
      expect(
        mockClient.chainHead.mock.storageSubscription,
      ).toHaveBeenLastCalledWith(
        initialHash,
        queries.slice(initialResponses.length),
        null,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )

      const lastResponses = responses.slice(initialResponses.length)
      mockClient.chainHead.mock.storageSubscription
        .getLastCall(initialHash)
        .sendDiscarded(0)
        .sendItems(lastResponses)
        .sendComplete()

      expect(observer.next).toHaveBeenCalledTimes(responses.length)
      responses.forEach((response) =>
        expect(observer.next).toHaveBeenCalledWith(response),
      )
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })

    it("recovers when getting a limitReached error", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initializeWithMetadata(mockClient)

      observe(chainHead.body$(initialHash))

      const queries: StorageItemInput[] = [
        {
          key: "foo",
          type: "value",
        },
        {
          key: "bar",
          type: "value",
        },
      ]
      const observer = observe(chainHead.storageQueries$(initialHash, queries))

      mockClient.chainHead.mock.storageSubscription
        .getLastCall(initialHash)
        .sendError(new OperationLimitError())

      expect(observer.next).not.toHaveBeenCalled()
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).not.toHaveBeenCalled()
      expect(
        mockClient.chainHead.mock.storageSubscription,
      ).toHaveBeenCalledOnce()

      await mockClient.chainHead.mock.body.reply(initialHash, [])
      expect(
        mockClient.chainHead.mock.storageSubscription,
      ).toHaveBeenCalledTimes(2)

      const responses = queries.map(({ key }) => ({
        key,
        value: `${key} response`,
      }))
      mockClient.chainHead.mock.storageSubscription
        .getLastCall(initialHash)
        .sendDiscarded(0)
        .sendItems(responses)
        .sendComplete()

      expect(observer.next).toHaveBeenCalledTimes(responses.length)
      expect(observer.error).not.toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })
  })
})

// cleans up the subscription after a macro task. Doing it too quickly might actually create a subscription, as there are delays internally.
const cleanup = async (unfollow: () => void) => {
  await wait()
  unfollow()
}
