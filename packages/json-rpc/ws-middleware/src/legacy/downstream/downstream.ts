import { JsonRpcMessage } from "@polkadot-api/json-rpc-provider"
import { createClient } from "@polkadot-api/raw-client"
import { noop } from "@polkadot-api/utils"
import { archive, chainHead, chainSpec, transaction } from "../../methods"
import { Middleware } from "../../types"
import { createUpstream } from "../upstream"
import { createArchive } from "./archive"
import { createChainSpec } from "./chainspec"
import { createTransactionFns } from "./transaction"
import { createChainHead } from "./chain-head"

const supportedMethods = new Set(
  [chainHead, chainSpec, archive, transaction]
    .map((methods) => Object.values(methods) as string[])
    .flat(),
)

export const withLegacy: Middleware = (base) => (onMessage, onHalt) => {
  let clean = noop
  let onMsg: (msg: JsonRpcMessage) => void = noop
  const innerConnection = base(
    (msg) => {
      onMsg(msg)
    },
    (e) => {
      clean()
      onHalt(e)
    },
  )
  const { disconnect, request } = createClient((_onMsg) => {
    onMsg = _onMsg
    return innerConnection
  }, onMessage)
  const upstream = createUpstream(request)

  const jsonRpc = (
    input:
      | ({ id: string } & (
          | { result: any }
          | { error: { code: number; message: string } }
        ))
      | {
          method: string
          params: { subscription: string; result: any }
        },
  ) =>
    onMessage({
      jsonrpc: "2.0",
      ...input,
    })

  const reply = (id: string, result: any) => {
    jsonRpc({ id, result })
  }
  const err = (id: string, code: number, message: string) => {
    jsonRpc({ id, error: { code, message } })
  }
  const notification = (method: string, subscription: string, result: any) => {
    jsonRpc({ method, params: { subscription, result } })
  }

  const groupsCtor: Record<string, () => any> = {
    chainSpec: () => createChainSpec(upstream, reply, err),
    chainHead: () => createChainHead(upstream, reply, err, notification),
    archive: () => createArchive(upstream, reply, err, notification),
    transaction: () => createTransactionFns(upstream, reply),
  }
  const groups: Record<string, any> = {}
  const getGroup = (name: string) => {
    if (name in groups) return groups[name]
    if (name in groupsCtor) return (groups[name] = groupsCtor[name]())
    return null
  }
  clean = () => {
    groups.chainHead?.stop()
    groups.archive?.stop()
    groups.transaction?.stop()
    upstream.clean()
  }

  return {
    send: (parsedMsg: any) => {
      if (!parsedMsg) return
      const { id, method, params } = parsedMsg
      if (
        (id !== null && typeof id !== "string" && typeof id !== "number") ||
        typeof method !== "string"
      ) {
        console.warn(`Invalid message:\n${JSON.stringify(parsedMsg)}`)
        return
      }
      if (method === "rpc_methods") {
        return upstream.methods.subscribe(
          ({ methods }) => {
            reply(id, {
              methods: [
                ...supportedMethods,
                ...methods.filter((method) => !supportedMethods.has(method)),
              ],
            })
          },
          (e: any) => {
            console.error(e)
            err(id, -32602, "Invalid")
          },
        )
      }

      const [groupName] = method.split("_")
      const group = getGroup(groupName)
      if (group) {
        try {
          return group(id, method, params)
        } catch (e) {
          if (e !== null) throw e
        }
      }

      upstream.request(
        method,
        params,
        (value) => {
          reply(id, value)
        },
        (e) => {
          err(id, e?.code || -1, e?.message || "")
        },
      )
    },
    disconnect: () => {
      clean()
      disconnect()
    },
  }
}
