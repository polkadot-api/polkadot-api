import { noop } from "@polkadot-api/utils"
import { createUpstream } from "../upstream"
import { createChainSpec } from "./chainspec"
import { createChainHead } from "./chain-head"
import { createTransactionFns } from "./transaction"
import { createArchive } from "./archive"
import { Middleware } from "../../../middleware/types"
import { createClient } from "@polkadot-api/raw-client"
import { JsonRpcMessage } from "@polkadot-api/json-rpc-provider"
import { archive, chainHead, chainSpec, transaction } from "../../methods"

const supportedMethods = new Set(
  [chainHead, chainSpec, archive, transaction]
    .map((methods) => Object.values(methods) as string[])
    .flat(),
)

export const getLegacy: Middleware = (base) => (onMessage, onHalt) => {
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
  })
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

  const groups = {
    chainSpec: createChainSpec(upstream, reply, err),
    chainHead: createChainHead(upstream, reply, err, notification),
    archive: createArchive(upstream, reply, err, notification),
    transaction: createTransactionFns(upstream, reply),
  }

  clean = () => {
    groups.chainHead.stop()
    groups.archive.stop()
    groups.transaction.stop()
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
      if (groupName in groups) {
        try {
          return groups[groupName as keyof typeof groups](id, method, params)
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
