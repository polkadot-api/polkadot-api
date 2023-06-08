import { GetProvider, ProviderStatus } from "@unstoppablejs/provider"
import { Client } from "./types"
import { ErrorRpc } from "./client/ErrorRpc"
import { createClient } from "./client/MultiplexedClient"
import { from } from "rxjs"

jest.useFakeTimers()

const getMockProvider = (statusChangeInterceptor?: {
  onStatusChange: (status: ProviderStatus) => void
}) => {
  const sent: string[] = []
  let _onMessage: (message: string) => void = () => {}

  const getProvider: GetProvider = (onMessage, onStatusChange) => {
    if (statusChangeInterceptor)
      statusChangeInterceptor.onStatusChange = onStatusChange
    _onMessage = onMessage

    const send = (message: string): void => {
      sent.push(message)
    }

    const open = () => {
      if (!statusChangeInterceptor) onStatusChange(ProviderStatus.ready)
    }

    const close = () => {
      sent.splice(0)
    }

    return { send, open, close }
  }
  return { getProvider, sent, onMessage: () => _onMessage }
}

describe("RPC Client", () => {
  let incommingMessage: (data: {}) => void = (_) => {}
  let client: Client
  let sent: string[]
  let onMessage: () => (msg: string) => void
  let getProvider: GetProvider

  const testLastMessage = (expected: {}): void => {
    const lastMessage = sent[sent.length - 1]
    expect(JSON.parse(lastMessage)).toEqual({
      jsonrpc: "2.0",
      ...expected,
    })
  }

  beforeEach(() => {
    ;({ getProvider, sent, onMessage } = getMockProvider())
    client = createClient(getProvider)
    client.connect()
    incommingMessage = (data: {}) => {
      onMessage()(JSON.stringify({ jsonrpc: "2.0", ...data }))
    }
  })

  afterEach(() => {
    client.disconnect()
  })

  describe("request/reply", () => {
    it("receives the reply to a request", async () => {
      expect(sent.length).toBe(0)

      const method = "getData"
      const params = ["foo", "bar"]
      const request = client.requestReply<{ foo: string }>(method, params)

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method,
        params,
      })

      const result = { foo: "foo" }

      incommingMessage({
        id: 1,
        result,
      })

      const response = await request
      expect(response).toEqual(result)
    })

    it("does't confuse null results with errors", async () => {
      expect(sent.length).toBe(0)

      const method = "getData"
      const params = ["foo", "bar"]
      const request = client.requestReply<{ foo: string }>(method, params)

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method,
        params,
      })

      const result = null

      incommingMessage({
        id: 1,
        result,
      })

      const response = await request
      expect(response).toEqual(result)
    })

    it("multiplexes ongoing requests", async () => {
      expect(sent.length).toBe(0)

      const method = "getData"
      const params = ["foo", "bar"]
      const request1 = client.requestReply<{ foo: string }>(method, params)
      const request2 = client.requestReply<{ foo: string }>(method, params)
      const request3 = client.requestReply<{ foo: string }>(method, params)
      const request4 = client.requestReply<{ foo: string }>(method, params)

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method,
        params,
      })

      const result = { foo: "foo" }

      incommingMessage({
        id: 1,
        result,
      })

      const responses = await Promise.all([
        request1,
        request2,
        request3,
        request4,
      ])
      expect(responses).toEqual(responses.map(() => result))
    })

    it("propagates RPC errors", async () => {
      expect(sent.length).toBe(0)

      const method = "getData"
      const params = ["foo", "bar"]
      const request = client.requestReply<{ foo: string }>(method, params)

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method,
        params,
      })

      incommingMessage({
        id: 1,
        error: {
          code: 1,
          message: "ko",
          data: "data",
        },
      })

      let error
      try {
        await request
      } catch (e) {
        error = e
      }

      expect(error).toEqual(
        new ErrorRpc({
          code: 1,
          message: "ko",
          data: "data",
        }),
      )
    })

    it("correctly cancels ongoing requests", async () => {
      expect(sent.length).toBe(0)

      const method = "getData"
      const params = ["foo", "bar"]

      const ab = new AbortController()
      const request = client.requestReply<{ foo: string }>(
        method,
        params,
        undefined,
        undefined,
        ab.signal,
      )

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method,
        params,
      })

      ab.abort()
      let error: Error = new Error()
      try {
        await request
      } catch (e: any) {
        error = e
      }
      expect(error instanceof Error && error.name === "AbortError").toBeTruthy()
    })
  })

  describe("observe", () => {
    it("observes values from subscription endpoints", () => {
      const subsMethod = "subscribeToData"
      const unsubMethod = "unsubscribeToData"
      const params = ["foo"]

      const observable = client.getObservable(
        subsMethod,
        unsubMethod,
        params,
        ({ foo }: { foo: string }) => foo,
      )

      expect(sent.length).toBe(0)

      const receivedValues: string[] = []
      const errors: any[] = []
      observable.subscribe(
        (value) => {
          receivedValues.push(value)
        },
        (e) => {
          errors.push(e)
        },
      )

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method: subsMethod,
        params,
      })
      expect(receivedValues).toEqual([])
      expect(errors).toEqual([])

      const subscription = "opaqueId"

      incommingMessage({
        params: {
          result: { foo: "foo" },
          subscription,
        },
      })

      expect(receivedValues).toEqual([])
      expect(errors).toEqual([])

      incommingMessage({
        id: 1,
        result: subscription,
      })

      expect(receivedValues).toEqual(["foo"])
      expect(errors).toEqual([])

      incommingMessage({
        params: {
          result: { foo: "bar" },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["foo", "bar"])
      expect(errors).toEqual([])

      expect(sent.length).toBe(1)

      incommingMessage({
        params: {
          error: {
            code: 1,
            message: "ko",
            data: "data",
          },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["foo", "bar"])
      expect(errors).toEqual([
        new ErrorRpc({
          code: 1,
          message: "ko",
          data: "data",
        }),
      ])
      expect(sent.length).toBe(2)
      testLastMessage({
        id: 2,
        method: unsubMethod,
        params: [subscription],
      })
    })

    it("returns interoperable observables", () => {
      const subsMethod = "subscribeToData"
      const unsubMethod = "unsubscribeToData"
      const params = ["foo"]

      const observable = from(
        client.getObservable(
          subsMethod,
          unsubMethod,
          params,
          ({ foo }: { foo: string }) => foo,
        ),
      )

      expect(sent.length).toBe(0)

      const receivedValues: string[] = []
      const errors: any[] = []
      observable.subscribe({
        next(value) {
          receivedValues.push(value)
        },
        error(e) {
          errors.push(e)
        },
      })

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method: subsMethod,
        params,
      })
      expect(receivedValues).toEqual([])
      expect(errors).toEqual([])

      const subscription = "opaqueId"

      incommingMessage({
        params: {
          result: { foo: "foo" },
          subscription,
        },
      })

      expect(receivedValues).toEqual([])
      expect(errors).toEqual([])

      incommingMessage({
        id: 1,
        result: subscription,
      })

      expect(receivedValues).toEqual(["foo"])
      expect(errors).toEqual([])

      incommingMessage({
        params: {
          result: { foo: "bar" },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["foo", "bar"])
      expect(errors).toEqual([])

      expect(sent.length).toBe(1)

      incommingMessage({
        params: {
          error: {
            code: 1,
            message: "ko",
            data: "data",
          },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["foo", "bar"])
      expect(errors).toEqual([
        new ErrorRpc({
          code: 1,
          message: "ko",
          data: "data",
        }),
      ])
      expect(sent.length).toBe(2)
      testLastMessage({
        id: 2,
        method: unsubMethod,
        params: [subscription],
      })
    })

    it("multiplexes existing subscriptions", () => {
      const subsMethod = "subscribeToData"
      const unsubMethod = "unsubscribeToData"
      const params = ["foo"]

      const observable = client.getObservable(
        subsMethod,
        unsubMethod,
        params,
        ({ foo }: { foo: string }) => foo,
      )

      const observable2 = client.getObservable<{ foo: string }>(
        subsMethod,
        unsubMethod,
        [...params],
      )

      expect(sent.length).toBe(0)

      const receivedValues: string[] = []
      const subs1 = observable.subscribe((value) => {
        receivedValues.push(value)
      })

      const receivedValues2: { foo: string }[] = []
      const subs2 = observable2.subscribe((value) => {
        receivedValues2.push(value)
      })

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method: subsMethod,
        params,
      })

      const subscription = "opaqueId"
      incommingMessage({
        id: 1,
        result: subscription,
      })
      incommingMessage({
        params: {
          result: { foo: "foo" },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["foo"])
      expect(receivedValues2).toEqual([{ foo: "foo" }])

      const receivedValues3: { data: string }[] = []
      const observable3 = client.getObservable(
        subsMethod,
        unsubMethod,
        [...params],
        (message: { foo: string }) => ({ data: message.foo }),
      )

      expect(receivedValues3).toEqual([])
      const subs3 = observable3.subscribe((message) => {
        receivedValues3.push(message)
      })

      expect(sent.length).toBe(1)
      expect(receivedValues3).toEqual([{ data: "foo" }])

      subs1()
      subs2()
      incommingMessage({
        params: {
          result: { foo: "bar" },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["foo"])
      expect(receivedValues2).toEqual([{ foo: "foo" }])
      expect(receivedValues3).toEqual([{ data: "foo" }, { data: "bar" }])

      expect(sent.length).toBe(1)

      subs3()

      expect(sent.length).toBe(2)
      testLastMessage({
        id: 2,
        method: unsubMethod,
        params: [subscription],
      })

      incommingMessage({
        params: {
          result: { foo: "baz" },
          subscription,
        },
      })

      expect(receivedValues3).toEqual([{ data: "foo" }, { data: "bar" }])
    })

    it("propagates RPC errors", () => {
      const subsMethod = "subscribeToData"
      const unsubMethod = "unsubscribeToData"
      const params = ["foo"]

      const observable = client.getObservable(
        subsMethod,
        unsubMethod,
        params,
        ({ foo }: { foo: string }) => foo,
      )

      expect(sent.length).toBe(0)

      const receivedValues: string[] = []
      const unsubscribe = observable.subscribe((value) => {
        receivedValues.push(value)
      })

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method: subsMethod,
        params,
      })
      expect(receivedValues).toEqual([])

      const subscription = "opaqueId"

      incommingMessage({
        params: {
          result: { foo: "foo" },
          subscription,
        },
      })

      expect(receivedValues).toEqual([])

      incommingMessage({
        id: 1,
        result: subscription,
      })

      expect(receivedValues).toEqual(["foo"])

      incommingMessage({
        params: {
          result: { foo: "bar" },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["foo", "bar"])
      expect(sent.length).toBe(1)

      unsubscribe()

      testLastMessage({
        id: 2,
        method: unsubMethod,
        params: [subscription],
      })
    })

    it("recicles the latest value of an active subscription for a request/reply", async () => {
      const subsMethod = "subscribeToData"
      const unsubMethod = "unsubscribeToData"
      const params = ["foo"]

      const observable = client.getObservable(
        subsMethod,
        unsubMethod,
        params,
        ({ foo }: { foo: string }) => foo,
      )

      expect(sent.length).toBe(0)

      const receivedValues: string[] = []
      const unsubscribe = observable.subscribe((value) => {
        receivedValues.push(value)
      })

      testLastMessage({
        id: 1,
        method: subsMethod,
        params,
      })
      expect(receivedValues).toEqual([])

      const subscription = "opaqueId"

      incommingMessage({
        params: {
          result: { foo: "foo" },
          subscription,
        },
      })

      expect(receivedValues).toEqual([])

      const reply = client.requestReply(
        "getData",
        params,
        undefined,
        subsMethod,
      )

      expect(sent.length).toBe(1)

      incommingMessage({
        id: 1,
        result: subscription,
      })

      expect(receivedValues).toEqual(["foo"])
      let response = await reply
      expect(response).toEqual({ foo: "foo" })

      incommingMessage({
        params: {
          result: { foo: "bar" },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["foo", "bar"])

      expect(sent.length).toBe(1)

      response = await client.requestReply(
        "getData",
        params,
        undefined,
        subsMethod,
      )

      expect(sent.length).toBe(1)
      expect(response).toEqual({ foo: "bar" })

      unsubscribe()

      expect(sent.length).toBe(2)

      client.requestReply("getData", params, undefined, subsMethod)

      expect(sent.length).toBe(3)
    })
  })

  describe("common", () => {
    it("throws on malformatted messages", () => {
      expect(() => incommingMessage({ params: {} })).toThrow()
      expect(() => incommingMessage({})).toThrow()
    })

    it("throws when trying to request on a disconnected client", async () => {
      client.disconnect()
      let error: any
      try {
        await client.requestReply("foo", [])
      } catch (e) {
        error = e
      }

      expect(error).toEqual(new Error("Not connected"))
    })

    it("batches requests until the provider is ready", async () => {
      const interceptor = { onStatusChange: (_: ProviderStatus) => {} }
      ;({ getProvider, sent, onMessage } = getMockProvider(interceptor))
      client = createClient(getProvider)
      client.connect()
      incommingMessage = (data: {}) => {
        onMessage()(JSON.stringify({ jsonrpc: "2.0", ...data }))
      }

      expect(sent.length).toBe(0)

      const method = "getData"
      const params = ["foo", "bar"]
      let ac = new AbortController()
      let request = client.requestReply<{ foo: string }>(
        method,
        params,
        undefined,
        undefined,
        ac.signal,
      )

      expect(sent.length).toBe(0)

      ac.abort()

      let error: any
      try {
        await request
      } catch (e) {
        error = e
      }

      expect(error instanceof Error && error.name === "AbortError").toBe(true)

      ac = new AbortController()
      request = client.requestReply<{ foo: string }>(
        method,
        params,
        undefined,
        undefined,
        ac.signal,
      )

      expect(sent.length).toBe(0)

      interceptor.onStatusChange(ProviderStatus.ready)

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 2,
        method,
        params,
      })

      ac.abort()

      error = undefined
      try {
        await request
      } catch (e) {
        error = e
      }

      expect(error instanceof Error && error.name === "AbortError").toBe(true)
    })

    it("periodically clears orfanMessages", async () => {
      const subsMethod = "subscribeToData"
      const unsubMethod = "unsubscribeToData"
      const params = ["foo"]

      const observable = client.getObservable(
        subsMethod,
        unsubMethod,
        params,
        ({ foo }: { foo: string }) => foo,
      )

      expect(sent.length).toBe(0)

      const receivedValues: string[] = []
      const errors: any[] = []
      const unsubscribe = observable.subscribe(
        (value) => {
          receivedValues.push(value)
        },
        (e) => {
          errors.push(e)
        },
      )

      expect(sent.length).toBe(1)
      testLastMessage({
        id: 1,
        method: subsMethod,
        params,
      })
      expect(receivedValues).toEqual([])
      expect(errors).toEqual([])

      const subscription = "opaqueId"

      incommingMessage({
        params: {
          result: { foo: "foo" },
          subscription,
        },
      })

      expect(receivedValues).toEqual([])
      expect(errors).toEqual([])

      jest.advanceTimersByTime(1_001)

      incommingMessage({
        params: {
          result: { foo: "bar" },
          subscription,
        },
      })

      jest.advanceTimersByTime(3_001)

      incommingMessage({
        id: 1,
        result: subscription,
      })

      expect(receivedValues).toEqual([])
      expect(errors).toEqual([])

      incommingMessage({
        params: {
          result: { foo: "bar" },
          subscription,
        },
      })

      expect(receivedValues).toEqual(["bar"])
      expect(errors).toEqual([])

      expect(sent.length).toBe(1)

      unsubscribe()
      testLastMessage({
        id: 2,
        method: unsubMethod,
        params: [subscription],
      })
    })
  })
})
