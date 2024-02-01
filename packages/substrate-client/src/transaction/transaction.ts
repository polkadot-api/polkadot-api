import { noop } from "@/internal-utils"
import type { ClientRequest } from "../client"
import type {
  TxEventRpc,
  TxFinalizedRpc,
  TxInvalidRpc,
  TxDroppedRpc,
  TxErrorRpc,
} from "./json-rpc-types"
import { TxEvent } from "./public-types"

type EventToType<T extends { event: string }> = T extends { event: infer Type }
  ? Omit<T, "event"> & { type: Type }
  : T
const eventToType = <T extends { event: string }>(input: T): EventToType<T> => {
  const { event: type, ...rest } = input
  return { type, ...rest } as any
}

type TerminalEvent = TxDroppedRpc | TxInvalidRpc | TxFinalizedRpc | TxErrorRpc
const terminalEvents: Set<string> = new Set<TerminalEvent["event"]>([
  "dropped",
  "invalid",
  "finalized",
  "error",
])

function isTerminalEvent(event: TxEventRpc): event is TerminalEvent {
  return terminalEvents.has(event.event)
}

type ErrorEvents = TxDroppedRpc | TxInvalidRpc | TxErrorRpc

export interface ITxError {
  type: ErrorEvents["event"]
  error: string
}

export class TransactionError extends Error implements ITxError {
  type
  error
  constructor(e: ErrorEvents) {
    super(`TxError: ${e.event} - ${e.error}`)
    this.type = e.event
    this.error = e.error
    this.name = "TransactionError"
  }
}

export const getTransaction =
  (request: ClientRequest<string, TxEventRpc>) =>
  (
    methodName: string,
    tx: string,
    next: (event: TxEvent) => void,
    error: (e: Error) => void,
  ) => {
    let cancel = request(methodName, [tx], {
      onSuccess: (subscriptionId, follow) => {
        const done = follow(subscriptionId, {
          next: (event) => {
            if (isTerminalEvent(event)) {
              done()
              cancel = noop
              if (event.event !== "finalized")
                return error(new TransactionError(event))
            }
            next(eventToType(event))
          },
          error(e) {
            cancel()
            cancel = noop
            error(e)
          },
        })

        cancel = () => {
          done()
          request("transaction_unstable_unwatch", [subscriptionId])
        }
      },
      onError: error,
    })

    return () => {
      cancel()
    }
  }
