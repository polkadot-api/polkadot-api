import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

const methods: Record<string, "follow" | "unfollow"> = {}
;["v1", "unstable"].forEach((version) => {
  methods[`chainHead_${version}_follow`] = "follow"
  methods[`chainHead_${version}_unfollow`] = "unfollow"
})

export const followEnhancer: (
  input: JsonRpcProvider,
  forceDisconnect: () => void,
) => JsonRpcProvider & {
  cleanup: () => void
} = (base, forceDisconnect) => {
  const prematureStops = new Set<string>()
  const preOpId = new Map<string, string>()
  const onGoing = new Set<string>()
  let methodsPending = true

  const result: JsonRpcProvider = (onMsg) => {
    const { send, disconnect } = base((fromProvider) => {
      const parsed = JSON.parse(fromProvider)
      // it's a response
      if ("id" in parsed) {
        const { id, result } = parsed
        if (methodsPending && result.methods) {
          methodsPending = false
          const methods: string[] = result.methods
          if (
            !methods.some((x) => {
              const [group, , name] = x.split("_")
              return group === "chainHead" && name === "follow"
            })
          ) {
            methodsPending = true
            onMsg(fromProvider)
            forceDisconnect()
            return
          }
        }

        const msg = preOpId.get(id)
        if (msg) {
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
            forceDisconnect()
            preOpId.set(id, msg)
            send(msg)
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
          preOpId.set(parsed.id, toProvider)
        } else if (method === "unfollow") {
          onGoing.delete(parsed.params[0])
        }
        send(toProvider)
      },
      disconnect,
    }
  }

  return Object.assign(result, {
    cleanup: () => {
      prematureStops.clear()
      preOpId.clear()
      onGoing.clear()
    },
  })
}
