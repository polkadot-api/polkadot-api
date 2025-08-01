import { createUpstream } from "@/upstream/upstream"
import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { createChainSpec } from "./chainspec"
import { createChainHead } from "./chain-head/chain-head"
import { createTransactionFns } from "./transaction"

const supportedMethods = [
  "chainHead_v1_body",
  "chainHead_v1_call",
  "chainHead_v1_follow",
  "chainHead_v1_header",
  "chainHead_v1_stopOperation",
  "chainHead_v1_storage",
  "chainHead_v1_continue",
  "chainHead_v1_unfollow",
  "chainHead_v1_unpin",
  "chainSpec_v1_chainName",
  "chainSpec_v1_genesisHash",
  "chainSpec_v1_properties",
  "transaction_v1_broadcast",
  "transaction_v1_stop",
]

export const createDownsstream = (
  upstreamProvider: JsonRpcProvider,
): JsonRpcProvider => {
  const upstream = createUpstream(upstreamProvider)
  return (onMessage) => {
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
      onMessage(
        JSON.stringify({
          jsonrpc: "2.0",
          ...input,
        }),
      )

    const reply = (id: string, result: any) => {
      jsonRpc({ id, result })
    }
    const err = (id: string, code: number, message: string) => {
      jsonRpc({ id, error: { code, message } })
    }

    const chainSpec = createChainSpec(upstream, reply, err)
    const chainHead = createChainHead(
      upstream,
      reply,
      err,
      (method, subscription, result) => {
        jsonRpc({ method, params: { subscription, result } })
      },
    )
    const txs = createTransactionFns(upstream, reply, err)

    return {
      send: (msg) => {
        let parsedMsg: any = null
        try {
          parsedMsg = JSON.parse(msg)
        } catch {}
        if (!parsedMsg) return
        const { id, method, params } = parsedMsg
        if (id !== null && typeof id !== "string" && typeof id !== "number") {
          return
        }
        if (method === "rpc_methods") {
          return upstream.methods.subscribe(
            ({ methods }) => {
              reply(id, {
                methods: [
                  ...supportedMethods,
                  ...methods.filter(
                    (method) =>
                      method.startsWith("chainHead") ||
                      method.startsWith("chainSpec"),
                  ),
                ],
              })
            },
            (e: any) => {
              console.error(e)
              err(id, -32602, "Invalid")
            },
          )
        }

        const mName = method.split("_")[2]
        if (method.startsWith("chainHead_v1"))
          return chainHead(id, mName, params)

        if (method.startsWith("chainSpec_v1")) return chainSpec(id, mName)

        if (method.startsWith("transaction_v1")) return txs(id, mName, params)

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
        upstream.disconnect()
      },
    }
  }
}
