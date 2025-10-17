import { chainHead } from "../methods"
import type { Middleware } from "../types"
import { JsonRpcRequest } from "@polkadot-api/json-rpc-provider"

export const unpinHash: Middleware =
  (base) =>
  (...args) => {
    const { send: _send, disconnect } = base(...args)

    const send = (msg: JsonRpcRequest) => {
      const { method, params, id, ...rest } = msg
      if (method == chainHead.unpin && params && Array.isArray(params[1])) {
        params[1].forEach((hash, idx) => {
          _send({
            ...rest,
            id: idx === 0 ? id : `${id}-patched-${idx}`,
            method,
            params: [params[0], hash],
          })
        })
      } else _send(msg)
    }

    return { send, disconnect }
  }
