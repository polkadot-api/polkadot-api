import {
  isResponse,
  JsonRpcConnection,
  JsonRpcId,
  JsonRpcMessage,
  JsonRpcRequest,
} from "@polkadot-api/json-rpc-provider"
import { ReconnectableJsonRpcConnection } from "./internal-types"
import { getOpaqueToken } from "./get-opaque-token"
import { jsonRpcReq, jsonRpcRsp } from "./json-rpc-message"

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
      msg: JsonRpcRequest
    }
  | { type: OngoingMsgType.ChainHeadOperation; id: string }
  | { type: OngoingMsgType.Other; msg: JsonRpcRequest }

const getInternalId = () => `___proxyInternalId__${getOpaqueToken()}`

export const getProxy: ReconnectableJsonRpcConnection = (
  toConsumer: (msg: JsonRpcMessage) => void,
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
        // the key is the upstream id, the value is the synthetic token
        pendingBroadcasts: Map<JsonRpcId, string>

        // These are requests for which their replies should be propagated downstream
        // Therefore, the `pendingBroadcasts` won't be included in here b/c they are synthetic
        onGoingRequests: Map<JsonRpcId, OngoingMsg>
      }
    | {
        type: State.Connecting
        pending: Array<JsonRpcRequest>
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

  const onMsgFromProvider = (parsed: JsonRpcMessage) => {
    let isActive = true
    if (state.type === State.Connected) {
      if (isResponse(parsed)) {
        const { id } = parsed
        const pendingBroadcast = state.pendingBroadcasts.get(id)
        if (pendingBroadcast) {
          state.pendingBroadcasts.delete(id)
          const synToken = state.pendingBroadcasts.get(id)!

          // it's guaranteed to be there b/c we control it
          if (!("result" in parsed)) return

          const upToken = parsed.result
          const activeBroadcast = state.activeBroadcasts.get(synToken)

          if (activeBroadcast)
            state.activeBroadcasts.get(synToken)!.upToken = upToken
          else
            // The consumer stopped before we got the response
            state.connection.send(
              jsonRpcReq({
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
    if (isActive && state.type !== State.Done) toConsumer(parsed)
  }

  const send = (msg: JsonRpcRequest) => {
    if (state.type === State.Done) return

    // Transaction methods are purely synthetic, so they must be handled separately
    if ("id" in msg) {
      const { method, id, params } = msg as {
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
            jsonRpcRsp({
              id,
              result: null,
            }),
          )

          if (state.type === State.Connected && active && active.upToken) {
            // The response from this request will be ignored later on
            // because it won't be among the ongoing requests. so, it won't get to downstream
            state.connection.send(
              jsonRpcReq({
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
            jsonRpcRsp({
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
    if (msg.method === "chainHead_v1_unfollow")
      state.activeChainHeads.delete(msg.params[0])

    if ("id" in msg) {
      const { method, id } = msg as { method: string; id: string }
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
            jsonRpcReq({
              method: "chainHead_v1_follow",
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
              jsonRpcRsp({
                id: x.id,
                error: { code: -32603, message: "Internal error" },
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
            jsonRpcReq({
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
