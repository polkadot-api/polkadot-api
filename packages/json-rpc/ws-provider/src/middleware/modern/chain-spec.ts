import type { ParsedJsonRpcEnhancer } from "../types"
import { chainSpec } from "./methods"

export const fixChainSpec: ParsedJsonRpcEnhancer =
  (base) =>
  (...args) => {
    const { send: originalSend, disconnect } = base(...args)

    const send = (msg: any) => {
      switch (msg.method) {
        case chainSpec.chainName:
          return originalSend({ ...msg, method: "system_chain" })
        case chainSpec.genesisHash:
          return originalSend({
            ...msg,
            method: "chain_getBlockHash",
            params: [0],
          })
        case chainSpec.properties:
          return originalSend({ ...msg, method: "system_properties" })
      }
      originalSend(msg)
    }

    return {
      send,
      disconnect,
    }
  }
