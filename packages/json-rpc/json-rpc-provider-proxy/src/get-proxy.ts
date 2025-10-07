import { JsonRpcConnection } from "@polkadot-api/json-rpc-provider"
import { ReconnectableJsonRpcConnection } from "./internal-types"
import { jsonRpcMsg } from "./json-rpc-message"
import { getOpaqueToken } from "./get-opaque-token"

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

const getInternalId = () => `___proxyInternalId__${getOpaqueToken()}`

export const getProxy: ReconnectableJsonRpcConnection = (
  toConsumer: (msg: string) => void,
) => {
  let state:
    | {
        type: State.Connected
        connection: JsonRpcConnection
        activeChainHeads: Set<string>
        activeBroadcasts: Map<
          string,
          { tx: string; synToken: string; upToken?: string }
        >
        // the key is the upstream id, the value is the syntethic token
        pendingBroadcasts: Map<string, string>

        // These are requests for which their replies should be propagated downstream
        // Therefore, the `pendingBroadcasts` won't be included in here b/c they are synthetic
        onGoingRequests: Map<string, OngoingMsg>
      }
    | {
        type: State.Connecting
        pending: Array<string>
        activeBroadcasts: Map<
          string,
          { tx: string; synToken: string; upToken?: string }
        >
      }
    | { type: State.Done } = {
    type: State.Connecting,
    activeBroadcasts: new Map(),
    pending: [],
  }

  const onMsgFromProvider = (msg: string) => {
    let isActive = true
    if (state.type === State.Connected) {
      const parsed = JSON.parse(msg)
      if ("id" in parsed) {
        const { id } = parsed
        if (state.pendingBroadcasts.has(id)) {
          const synToken = state.pendingBroadcasts.get(id)!
          const upToken = parsed.result
          state.pendingBroadcasts.delete(id)
          const activeBroadcast = state.activeBroadcasts.get(synToken)

          if (activeBroadcast)
            state.activeBroadcasts.get(synToken)!.upToken = upToken
          else
            // The consumer stopped before we got the response
            state.connection.send(
              jsonRpcMsg({
                id: getInternalId(),
                method: "transaction_v1_stop",
                params: [upToken],
              }),
            )

          return
        }

        isActive = state.onGoingRequests.has(id)
        if (
          "result" in parsed &&
          state.onGoingRequests.get(id)?.type === OngoingMsgType.ChainHeadFollow
        )
          state.activeChainHeads.add(parsed.result)
        state.onGoingRequests.delete(parsed.id)
      } else if ("params" in parsed) {
        const { subscription, result } = parsed.params
        if (result?.event === "stop")
          state.activeChainHeads.delete(subscription)
      }
    }
    // If the state is "Connecting", then these are messages
    // sent from the `onHalt` function. So, we mus realy them
    if (isActive && state.type !== State.Done) toConsumer(msg)
  }

  const send = (msg: string) => {
    if (state.type === State.Done) return
    const parsed = JSON.parse(msg)

    // Transaction methods are purely syntethic, so they myst be handled separately
    if ("id" in parsed) {
      const { method, id, params } = parsed as {
        method: string
        id: string
        params: string[]
      }
      const [group, , methodName] = method.split("_")

      if (group === "transaction") {
        if (methodName === "stop") {
          const [synToken] = params
          const active = state.activeBroadcasts.get(synToken)
          state.activeBroadcasts.delete(synToken)
          toConsumer(
            jsonRpcMsg({
              id,
              result: null,
            }),
          )

          if (state.type === State.Connected && active && active.upToken) {
            // The response from this request will be ignorned later on
            // because it won't be among the ongoing requests. so, it won't get to downstream
            state.connection.send(
              jsonRpcMsg({
                id,
                method,
                params: [active.upToken],
              }),
            )
          }

          // prevents the request from being included into the ongoingRequests
          return
        }

        if (methodName === "broadcast") {
          const synToken = getOpaqueToken()
          state.activeBroadcasts.set(synToken, {
            tx: params[0],
            synToken,
          })

          if (state.type === State.Connected) {
            state.pendingBroadcasts.set(id, synToken)
            state.connection.send(msg)
          }

          toConsumer(
            jsonRpcMsg({
              id,
              result: synToken,
            }),
          )

          // prevents the request to be tracked with the ongoingRequests
          return
        }
      }
    }

    if (state.type === State.Connecting) {
      state.pending.push(msg)
      return
    }
    if (parsed.method === "chainHead_v1_unfollow")
      state.activeChainHeads.delete(parsed.params[0])

    if ("id" in parsed) {
      const { method, id } = parsed as { method: string; id: string }
      const [group, , methodName] = method.split("_")

      const ongoingMsg: OngoingMsg =
        group === "chainHead"
          ? methodName === "follow"
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

      const { pending, activeBroadcasts } = state
      const onGoingRequests = new Map<string, OngoingMsg>()
      const activeChainHeads = new Set<string>()
      const onHalt = () => {
        const activeBroadcasts: Map<
          string,
          { tx: string; synToken: string; upToken?: string }
        > = state.type !== State.Done ? state.activeBroadcasts : new Map()
        activeBroadcasts.forEach((x) => (x.upToken = undefined))
        state = {
          type: State.Connecting,
          activeBroadcasts,
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
        activeBroadcasts,
        pendingBroadcasts: new Map(),
        onGoingRequests,
        activeChainHeads,
      }
      activeBroadcasts.forEach((broadcast) => {
        if (state.type === State.Connected) {
          const id = getInternalId()
          state.pendingBroadcasts.set(id, broadcast.synToken)
          send(
            jsonRpcMsg({
              id,
              method: "transaction_v1_broadcast",
              params: [broadcast.tx],
            }),
          )
        }
      })
      pending.forEach(send)
    },
  }
}
