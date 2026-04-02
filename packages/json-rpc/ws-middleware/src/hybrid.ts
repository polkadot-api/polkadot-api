import {
  JsonRpcConnection,
  JsonRpcMessage,
} from "@polkadot-api/json-rpc-provider"
import { filter, Subject, Subscription, take } from "rxjs"
import { withLegacy } from "./legacy"
import { modern } from "./modern"
import { Middleware } from "./types"

const modernGroups = ["chainHead", "transaction", "chainSpec", "archive"].map(
  (name) => `${name}_v1`,
)

export const hybridMiddleware = (methods: string[]): Middleware => {
  const individualChecks = Object.fromEntries(
    modernGroups.map((group) => [
      group,
      !!methods.find((v) => v.startsWith(group)),
    ]),
  )

  return (base) => {
    const multiplexed = multiplex(base)
    const modernProvider = modern(multiplexed)
    const legacyProvider = withLegacy(multiplexed)

    return (onMsg, onHalt) => {
      const modernConnection = modernProvider((message) => {
        if ("error" in message && message.error.code === -32800) {
          console.warn("Max follow connections received: chainHead_v1 disabled")
          individualChecks.chainHead_v1 = false
        }
        onMsg(message)
      }, onHalt)
      const legacyConnection = legacyProvider(onMsg, onHalt)

      return {
        send(message) {
          for (const group of modernGroups) {
            if (message.method.startsWith(group)) {
              if (individualChecks[group]) {
                modernConnection.send(message)
              } else {
                legacyConnection.send(message)
              }
              return
            }
          }
          modernConnection.send(message)
        },
        disconnect() {
          modernConnection.disconnect()
          legacyConnection.disconnect()
        },
      }
    }
  }
}

const multiplex: Middleware = (base) => {
  const halt$ = new Subject<any>()
  const msg$ = new Subject<JsonRpcMessage>()

  let refCount = 0
  let baseConnection: JsonRpcConnection | null = null

  return (onMsg, onHalt) => {
    refCount++
    baseConnection ??= base(
      (msg) => msg$.next(msg),
      (e) => halt$.next(e),
    )

    const notificationSub = msg$
      .pipe(filter((v) => v.id == null))
      .subscribe(onMsg)
    const haltSub = halt$.subscribe(onHalt)
    const responseSubs = new Set<Subscription>()

    return {
      send(message) {
        if (message.id == null) {
          return baseConnection?.send(message)
        }
        const id = message.id
        const responseSub = msg$
          .pipe(
            filter((r) => r.id === id),
            take(1),
          )
          .subscribe((msg) => {
            onMsg(msg)
            if (!responseSub) throw new Error("unreachable")
            responseSubs.delete(responseSub)
          })
        responseSubs.add(responseSub)
        baseConnection?.send(message)
      },
      disconnect() {
        notificationSub.unsubscribe()
        haltSub.unsubscribe()
        responseSubs.forEach((s) => s.unsubscribe())
        refCount--
        if (refCount === 0) {
          baseConnection?.disconnect()
        }
      },
    }
  }
}
