import type { ParsedJsonRpcEnhancer } from "../types"

const methods: Record<string, "follow" | "unfollow"> = {}
;["v1", "unstable"].forEach((version) => {
  methods[`chainHead_${version}_follow`] = "follow"
  methods[`chainHead_${version}_unfollow`] = "unfollow"
})

const resetStops = () => ({ latest: Date.now(), count: 0 })

export const followEnhancer: ParsedJsonRpcEnhancer =
  (base) => (onMsg, onHalt) => {
    const prematureStops = new Set<string>()
    const preOpId = new Map<string, any>()
    const onGoing = new Set<string>()
    let nStops: { latest: number; count: number } = resetStops()
    const cleanup = () => {
      ;[prematureStops, preOpId, onGoing].forEach((x) => {
        x.clear()
      })
    }

    const forceDisconnect = () => {
      disconnect()
      cleanup()
      onHalt()
    }

    const { send, disconnect } = base(
      (parsed: any) => {
        // it's a response
        if ("id" in parsed) {
          const { id, result } = parsed

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

        onMsg(parsed)
        if (nStops.count > 2) {
          nStops = resetStops()
          forceDisconnect()
        }
      },
      (e) => {
        cleanup()
        onHalt(e)
      },
    )

    return {
      send(parsed: any) {
        const method = methods[parsed.method]
        if (method === "follow") {
          preOpId.set(parsed.id, parsed)
        } else if (method === "unfollow") {
          onGoing.delete(parsed.params[0])
        }
        send(parsed)
      },
      disconnect,
    }
  }
