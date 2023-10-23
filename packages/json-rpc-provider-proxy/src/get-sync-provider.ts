import type { RequestId } from "./internal-types"
import type { ConnectProvider, Provider } from "@polkadot-api/json-rpc-provider"
import { getSubscriptionManager } from "./subscription-manager"

export type ConnectAsyncProvider = (
  onMessage: (message: string) => void,
  onHalt: () => void,
) => Provider

export const getSyncProvider =
  (input: () => Promise<ConnectAsyncProvider>): ConnectProvider =>
  (onMessage) => {
    // if it's null it means that the consumer has called `disconnect`
    // of it's a Promise it means that it's being respolved, otherwise it's resolved
    let provider: Provider | Promise<Provider> | null

    let bufferedMessages: Array<string> = []
    const pendingResponses = new Set<RequestId>()
    const subscriptionManager = getSubscriptionManager()

    const onMessageProxy = (message: string) => {
      let parsed: any
      try {
        parsed = JSON.parse(message)
      } catch (_) {
        console.error(`Unable to parse incoming message: ${message}`)
        return
      }

      if (parsed.id !== undefined) {
        pendingResponses.delete(parsed.id)
        subscriptionManager.onResponse(parsed)
      } else {
        subscriptionManager.onNotifiaction(parsed)
      }

      onMessage(message)
    }

    const send = (message: string) => {
      if (!provider) return

      const parsed = JSON.parse(message)
      subscriptionManager.onSent(parsed)
      if (parsed.id) pendingResponses.add(parsed.id)

      if (provider instanceof Promise) {
        bufferedMessages.push(message)
      } else provider.send(message)
    }

    const onHalt = (): Promise<Provider> => {
      bufferedMessages = []
      const pendingResponsesCopy = [...pendingResponses]
      pendingResponses.clear()

      // it means that the user has disconnected while the
      // provider promise was being rejected. Therefore, we must
      // throw to prevent the Promise from recovering.
      // The rejection will be handled from the teardown logic.
      if (!provider) throw null

      // It needs to restart before sending the errored
      // responses/notifications because the consumer may
      // react to those by sending new requests
      const result = start()

      subscriptionManager.onAbort().forEach((msg) => {
        onMessage(JSON.stringify(msg))
      })

      pendingResponsesCopy.forEach((id) => {
        onMessage(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32603, message: "Internal error" },
            id,
          }),
        )
      })

      return result
    }

    const start = (): Promise<Provider> => {
      const onResolve = (getProvider: ConnectAsyncProvider) => {
        let halted = false
        const _onHalt = () => {
          if (halted) return
          halted = true
          onHalt()
        }
        const _onMessageProxy = (msg: string) => {
          if (halted) return
          onMessageProxy(msg)
        }

        const result = getProvider(_onMessageProxy, _onHalt)
        bufferedMessages.forEach((m) => {
          result.send(m)
        })
        bufferedMessages = []
        return (provider = result)
      }

      provider = input().then(onResolve, withMacroTask(onHalt))
      return provider
    }

    const disconnect = () => {
      if (!provider) return

      const finishIt = (input: Provider | null) => {
        subscriptionManager.onAbort()
        pendingResponses.clear()
        provider = null
        input?.disconnect()
      }

      if (provider instanceof Promise) {
        provider.then(finishIt, finishIt)
        provider = null
      } else finishIt(provider)
    }

    start()
    return {
      send,
      disconnect,
    }
  }

const withMacroTask =
  <Args extends Array<any>, T>(
    inputFn: (...args: Args) => Promise<T>,
  ): ((...args: Args) => Promise<T>) =>
  (...args) =>
    new Promise((res) => setTimeout(res, 0)).then(() => inputFn(...args))
