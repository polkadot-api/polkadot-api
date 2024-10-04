import { JsonRpcConnection } from "@polkadot-api/json-rpc-provider"
import { ReconnectableJsonRpcConnection } from "./internal-types"
import { jsonRpcMsg } from "./json-rpc-message"

const enum State {
  Connected,
  Connecting,
  Done,
}

const enum OngoingMsgType {
  ChainHeadFollow,
  ChainHeadOperation,
  Other,
}
type OngoingMsg =
  | {
      type: OngoingMsgType.ChainHeadFollow
      msg: string
    }
  | { type: OngoingMsgType.ChainHeadOperation; id: string }
  | { type: OngoingMsgType.Other; msg: string }

const unfollowMethods = new Set(
  ["v1", "unstable"].map((x) => `chainHead_${x}_unfollow`),
)

export const getProxy: ReconnectableJsonRpcConnection = (
  toConsumer: (msg: string) => void,
) => {
  let state:
    | {
        type: State.Connected
        connection: JsonRpcConnection
        onGoingRequests: Map<string, OngoingMsg>
        activeChainHeads: Set<string>
      }
    | { type: State.Connecting; pending: Array<string> }
    | { type: State.Done } = {
    type: State.Connecting,
    pending: [],
  }

  const onMsgFromProvider = (msg: string) => {
    if (state.type === State.Connected) {
      const parsed = JSON.parse(msg)
      if ("id" in parsed) {
        if (
          state.onGoingRequests.get(parsed.id)?.type ===
          OngoingMsgType.ChainHeadFollow
        )
          state.activeChainHeads.add(parsed.result)
        state.onGoingRequests.delete(parsed.id)
      } else {
        const { subscription, result } = parsed.params
        if (result?.event === "stop")
          state.activeChainHeads.delete(subscription)
      }
    }
    // If the state is "Connecting", then these are messages
    // sent from the `onHalt` function. So, we mus realy them
    if (state.type !== State.Done) toConsumer(msg)
  }

  const send = (msg: string) => {
    if (state.type === State.Done) return
    if (state.type === State.Connecting) {
      state.pending.push(msg)
      return
    }
    const parsed = JSON.parse(msg)
    if (unfollowMethods.has(parsed.method))
      state.activeChainHeads.delete(parsed.params[0])

    if ("id" in parsed) {
      const { method, id } = parsed as { method: string; id: string }
      const ongoingMsg: OngoingMsg = method.startsWith("chainHead")
        ? method.endsWith("follow")
          ? {
              type: OngoingMsgType.ChainHeadFollow,
              msg,
            }
          : { type: OngoingMsgType.ChainHeadOperation, id }
        : { type: OngoingMsgType.Other, msg }
      state.onGoingRequests.set(id, ongoingMsg)
    }

    state.connection.send(msg)
  }

  return {
    send,
    disconnect: () => {
      if (state.type === State.Done) return
      if (state.type === State.Connected) state.connection.disconnect()
      state = { type: State.Done }
    },
    connect: (cb) => {
      if (state.type !== State.Connecting) throw new Error("Nonesense")

      const { pending } = state
      const onGoingRequests = new Map<string, OngoingMsg>()
      const activeChainHeads = new Set<string>()
      const onHalt = () => {
        state = {
          type: State.Connecting,
          pending: [],
        }
        activeChainHeads.forEach((subscription) => {
          // We don't send the messages directy to the consumer
          // b/c they could have disconnected after receiving one
          // of these messages. The `onMsgFromProvider` fn handles that
          onMsgFromProvider(
            jsonRpcMsg({
              params: {
                subscription,
                result: {
                  event: "stop",
                  internal: true,
                },
              },
            }),
          )
        })
        activeChainHeads.clear()
        for (const x of onGoingRequests.values()) {
          if (x.type === OngoingMsgType.ChainHeadOperation)
            onMsgFromProvider(
              jsonRpcMsg({
                id: x.id,
                error: { code: -32603, message: "Internal error" },
                internal: true,
              }),
            )
          else send(x.msg)
        }
        onGoingRequests.clear()
      }
      state = {
        type: State.Connected,
        connection: cb(onMsgFromProvider, onHalt),
        onGoingRequests,
        activeChainHeads,
      }
      pending.forEach(send)
    },
  }
}
