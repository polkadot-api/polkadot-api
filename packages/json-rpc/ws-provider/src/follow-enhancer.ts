import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { WsJsonRpcProvider } from "./types"

const methods: Record<string, "follow" | "unfollow"> = {}
;["v1", "unstable"].forEach((version) => {
  methods[`chainHead_${version}_follow`] = "follow"
  methods[`chainHead_${version}_unfollow`] = "unfollow"
})

export const followEnhancer: (input: WsJsonRpcProvider) => WsJsonRpcProvider = (
  base,
) => {
  const { getStatus } = base
  const prematureStops = new Set<string>()
  const preOpId = new Set<string>()
  const onGoing = new Set<string>()

  const clear = () => {
    prematureStops.clear()
    preOpId.clear()
    onGoing.clear()
  }
  const enhancedSwitch: typeof base.switch = (...args) => {
    clear()
    base.switch(...args)
  }

  const result: JsonRpcProvider = (onMsg) => {
    const { send, disconnect } = base((fromProvider) => {
      const parsed = JSON.parse(fromProvider)
      // it's a response
      if ("id" in parsed) {
        const { id, result } = parsed
        if (preOpId.has(id)) {
          preOpId.delete(id)
          if (prematureStops.has(result)) {
            prematureStops.delete(result)
            return
          }

          onGoing.add(result)
          const currentSize = onGoing.size + preOpId.size
          if (currentSize > 2)
            console.warn(
              `Too many chainHead follow subscriptions (${currentSize})`,
            )
          else if (parsed.error) {
            console.warn(`chainHead follow failed on the ${currentSize} sub`)
            Promise.resolve().then(() => enhancedSwitch())
            return
          }
        }
      } else {
        // it's a notifiaction
        const { subscription, result } = (parsed as any).params
        if (result?.event === "stop") {
          if (onGoing.has(subscription)) onGoing.delete(subscription)
          else prematureStops.add(subscription)
        }
      }
      onMsg(fromProvider)
    })

    return {
      send(toProvider) {
        const parsed = JSON.parse(toProvider)
        const method = methods[parsed.method]
        if (method === "follow") {
          preOpId.add(parsed.id)
        } else if (method === "unfollow") {
          onGoing.delete(parsed.params[0])
        }
        send(toProvider)
      },
      disconnect() {
        clear()
        disconnect()
      },
    }
  }

  return Object.assign(result, {
    getStatus,
    switch: enhancedSwitch,
  })
}
