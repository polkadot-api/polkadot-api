import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

const methods: Record<string, "follow" | "unfollow"> = {}
;["v1", "unstable"].forEach((version) => {
  methods[`chainHead_${version}_follow`] = "follow"
  methods[`chainHead_${version}_unfollow`] = "unfollow"
})

const resetStops = () => ({ latest: Date.now(), count: 0 })

export const followEnhancer: (
  input: JsonRpcProvider,
  forceDisconnect: () => void,
) => JsonRpcProvider & {
  cleanup: () => void
} = (base, forceDisconnect) => {
  const prematureStops = new Set<string>()
  const preOpId = new Map<string, string>()
  const onGoing = new Set<string>()
  let methodsRequestId: string | undefined
  let nStops: { latest: number; count: number } = resetStops()

  const result: JsonRpcProvider = (onMsg) => {
    const { send, disconnect } = base((fromProvider) => {
      const parsed = JSON.parse(fromProvider)
      // it's a response
      if ("id" in parsed) {
        const { id, result } = parsed
        if (id === methodsRequestId) {
          methodsRequestId = undefined
          if (
            result &&
            !(result.methods as string[]).some((x) => {
              const [group, , name] = x.split("_")
              return group === "chainHead" && name === "follow"
            })
          ) {
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
          const diff = Date.now() - nStops.latest
          nStops.latest += diff
          nStops.count = diff < 1000 ? nStops.count + 1 : 1

          if (onGoing.has(subscription)) onGoing.delete(subscription)
          else prematureStops.add(subscription)
        }
      }

      onMsg(fromProvider)
      if (nStops.count > 2) {
        nStops = resetStops()
        forceDisconnect()
      }
    })

    return {
      send(toProvider) {
        const parsed = JSON.parse(toProvider)
        if (parsed.method === "rpc_methods") methodsRequestId = parsed.id

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
