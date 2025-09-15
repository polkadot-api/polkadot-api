import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { createUpstream } from "@/upstream"
import { chainSpecMethods, createChainSpec } from "./chainspec"
import { chainHeadMethods, createChainHead } from "./chain-head"
import { createTransactionFns, transactionMethods } from "./transaction"
import { archiveMethods, createArchive } from "./archive"
import { withNumericIds } from "@/with-numeric"

const supportedMethods = [
  chainSpecMethods,
  archiveMethods,
  chainHeadMethods,
  transactionMethods,
]
  .map((methods) => Object.values(methods) as string[])
  .flat()

export const createDownstream =
  () =>
  (upstreamProvider: JsonRpcProvider): JsonRpcProvider => {
    const upstream = createUpstream(withNumericIds(upstreamProvider))
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
      const notification = (
        method: string,
        subscription: string,
        result: any,
      ) => {
        jsonRpc({ method, params: { subscription, result } })
      }

      const groups = {
        chainSpec: createChainSpec(upstream, reply, err),
        chainHead: createChainHead(upstream, reply, err, notification),
        archive: createArchive(upstream, reply, err, notification),
        transaction: createTransactionFns(upstream, reply),
      }
      return {
        send: (msg) => {
          let parsedMsg: any = null
          try {
            parsedMsg = JSON.parse(msg)
          } catch {}
          if (!parsedMsg) return
          const { id, method, params } = parsedMsg
          if (
            (id !== null && typeof id !== "string" && typeof id !== "number") ||
            typeof method !== "string"
          ) {
            console.warn(`Invalid message:\n${msg}`)
            return
          }
          if (method === "rpc_methods") {
            return upstream.methods.subscribe(
              ({ methods }) => {
                reply(id, {
                  methods: [
                    ...supportedMethods,
                    ...methods.filter(
                      (method) => !supportedMethods.includes(method),
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

          const [groupName] = method.split("_")
          if (groupName in groups) {
            try {
              return groups[groupName as keyof typeof groups](
                id,
                method,
                params,
              )
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
          upstream.disconnect()
        },
      }
    }
  }
